import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import YTDlpWrap from 'yt-dlp-wrap'
import ffmpegPath from 'ffmpeg-static'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { JwtRestAuthGuard } from '../../../common/guards/jwt-rest-auth.guard'
import { ForbiddenException } from '../../../common/errors'
import type { IJwtUser } from '../../../common/types'
import type { IVideoInfo, IYtDlpRawInfo, VideoQuality } from '../interfaces/youtube.interfaces'
import { YoutubeDownloadDto } from './dto/youtube-download.dto'
import { YoutubeInfoDto } from './dto/youtube-info.dto'

interface AuthenticatedRequest extends Request {
  user: IJwtUser
}

const YT_DLP_BINARY = path.join(process.cwd(), '.yt-dlp')
const COOKIES_FILE = path.join(os.tmpdir(), 'ceicavs-yt-cookies.txt')
const MAX_CONCURRENT = parseInt(process.env.YOUTUBE_MAX_CONCURRENT ?? '3', 10)

const QUALITY_FORMAT: Record<VideoQuality, string> = {
  '1080p': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]',
  '720p':  'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best[height<=720]',
  '480p':  'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio/best[height<=480]',
  audio:   'bestaudio[ext=m4a]/bestaudio',
}

let ytDlpReady: Promise<YTDlpWrap> | null = null
let cookiesReady: string[] | null = null
let activeDownloads = 0

function getYtDlp(): Promise<YTDlpWrap> {
  if (!ytDlpReady) {
    ytDlpReady = (async () => {
      if (!fs.existsSync(YT_DLP_BINARY)) {
        await YTDlpWrap.downloadFromGithub(YT_DLP_BINARY)
      }
      return new YTDlpWrap(YT_DLP_BINARY)
    })()
  }
  return ytDlpReady
}

function cookiesArgs(): string[] {
  if (cookiesReady !== null) return cookiesReady
  const b64 = process.env.YOUTUBE_COOKIES_B64
  const raw = process.env.YOUTUBE_COOKIES_TXT
  const decoded = b64 ? Buffer.from(b64.replace(/\s+/g, ''), 'base64').toString('utf8') : raw
  if (!decoded) {
    cookiesReady = []
    return cookiesReady
  }
  fs.writeFileSync(COOKIES_FILE, decoded, { mode: 0o600 })
  cookiesReady = ['--cookies', COOKIES_FILE]
  return cookiesReady
}

function ffmpegArgs(): string[] {
  return ffmpegPath ? ['--ffmpeg-location', ffmpegPath] : []
}

@Controller('tools/youtube')
@UseGuards(JwtRestAuthGuard)
export class YoutubeDownloadController {
  @Get('info')
  async info(
    @Req() req: AuthenticatedRequest,
    @Query() query: YoutubeInfoDto,
  ): Promise<IVideoInfo> {
    const ability = defineAbilityFor(req.user.role)
    if (!ability.can(Action.READ, Subject.TOOL)) {
      throw new ForbiddenException()
    }

    const ytDlp = await getYtDlp()
    const raw = await ytDlp.getVideoInfo([query.url, '--no-playlist', ...cookiesArgs()]) as IYtDlpRawInfo

    return {
      title: raw.title ?? 'Unknown',
      thumbnail: raw.thumbnail ?? '',
      durationSeconds: raw.duration ?? 0,
    }
  }

  @Post('download')
  async download(
    @Req() req: AuthenticatedRequest,
    @Body() body: YoutubeDownloadDto,
    @Res() res: Response,
  ): Promise<void> {
    const ability = defineAbilityFor(req.user.role)
    if (!ability.can(Action.READ, Subject.TOOL)) {
      throw new ForbiddenException()
    }

    if (activeDownloads >= MAX_CONCURRENT) {
      throw new ServiceUnavailableException('Server busy — try again in a moment')
    }

    activeDownloads++
    let released = false
    function release(): void {
      if (!released) {
        released = true
        activeDownloads = Math.max(0, activeDownloads - 1)
      }
    }

    const isAudio = body.quality === 'audio'
    const ext = isAudio ? 'mp3' : 'mp4'
    const tmpFile = path.join(os.tmpdir(), `ceicavs-yt-${Date.now()}.${ext}`)

    try {
      const ytDlp = await getYtDlp()
      const raw = await ytDlp.getVideoInfo([body.url, '--no-playlist', ...cookiesArgs()]) as IYtDlpRawInfo
      const title = (raw.title ?? 'video').replace(/[^\w\s-]/g, '').trim()

      const dlArgs = isAudio
        ? [
            body.url,
            '-f', QUALITY_FORMAT[body.quality],
            '-x',
            '--audio-format', 'mp3',
            '-o', tmpFile,
            '--no-playlist',
            ...cookiesArgs(),
            ...ffmpegArgs(),
          ]
        : [
            body.url,
            '-f', QUALITY_FORMAT[body.quality],
            '--merge-output-format', 'mp4',
            '-o', tmpFile,
            '--no-playlist',
            ...cookiesArgs(),
            ...ffmpegArgs(),
          ]

      await ytDlp.execPromise(dlArgs)

      const stat = fs.statSync(tmpFile)
      res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4')
      res.setHeader('Content-Disposition', `attachment; filename="${title}.${ext}"`)
      res.setHeader('Content-Length', stat.size)

      const fileStream = fs.createReadStream(tmpFile)

      fileStream.on('close', () => {
        release()
        fs.unlink(tmpFile, () => undefined)
      })

      fileStream.pipe(res)
    } catch {
      release()
      fs.unlink(tmpFile, () => undefined)
      throw new InternalServerErrorException('Download failed')
    }
  }
}
