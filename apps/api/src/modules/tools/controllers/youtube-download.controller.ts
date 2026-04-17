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
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { JwtRestAuthGuard } from '../../../common/guards/jwt-rest-auth.guard'
import { ForbiddenException } from '../../../common/errors'
import type { IJwtUser } from '../../../common/types'
import type { IVideoInfo, VideoQuality } from '../interfaces/youtube.interfaces'
import { YoutubeDownloadDto } from './dto/youtube-download.dto'
import { YoutubeInfoDto } from './dto/youtube-info.dto'

interface AuthenticatedRequest extends Request {
  user: IJwtUser
}

interface OEmbedResponse {
  title?: string
  thumbnail_url?: string
}

interface CobaltSuccessResponse {
  status: 'tunnel' | 'redirect'
  url: string
  filename?: string
}

type CobaltResponse =
  | CobaltSuccessResponse
  | { status: 'error'; error?: { code?: string } }
  | { status: 'picker' }
  | { status: 'local-processing' }

interface CobaltPayload {
  url: string
  videoQuality?: string
  audioFormat?: string
  downloadMode?: 'auto' | 'audio' | 'mute'
  filenameStyle?: string
}

const COBALT_API_URL = process.env.COBALT_API_URL ?? 'https://api.cobalt.tools/'
const MAX_CONCURRENT = parseInt(process.env.YOUTUBE_MAX_CONCURRENT ?? '3', 10)
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

let activeDownloads = 0

function cobaltPayload(url: string, quality: VideoQuality): CobaltPayload {
  if (quality === 'audio') {
    return { url, downloadMode: 'audio', audioFormat: 'mp3', filenameStyle: 'basic' }
  }
  return { url, videoQuality: quality.replace('p', ''), downloadMode: 'auto', filenameStyle: 'basic' }
}

async function callCobalt(payload: CobaltPayload): Promise<CobaltSuccessResponse> {
  const res = await fetch(COBALT_API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': BROWSER_UA,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json() as CobaltResponse
  if (data.status === 'tunnel' || data.status === 'redirect') {
    return data
  }
  if (data.status === 'error') {
    throw new InternalServerErrorException(`cobalt: ${data.error?.code ?? 'error'}`)
  }
  throw new InternalServerErrorException(`cobalt: ${data.status}`)
}

async function fetchOEmbed(url: string): Promise<OEmbedResponse> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl, { headers: { 'User-Agent': BROWSER_UA } })
    if (!res.ok) return {}
    return await res.json() as OEmbedResponse
  } catch {
    return {}
  }
}

async function fetchDuration(url: string): Promise<number> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': BROWSER_UA } })
    if (!res.ok) return 0
    const html = await res.text()
    const match = html.match(/"lengthSeconds":"(\d+)"/)
    return match ? parseInt(match[1], 10) : 0
  } catch {
    return 0
  }
}

function sanitizeFilename(name: string, fallback: string): string {
  const cleaned = name.replace(/[^\w\s.-]/g, '').trim()
  return cleaned.length > 0 ? cleaned : fallback
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

    const [oembed, durationSeconds] = await Promise.all([
      fetchOEmbed(query.url),
      fetchDuration(query.url),
    ])

    return {
      title: oembed.title ?? 'Unknown',
      thumbnail: oembed.thumbnail_url ?? '',
      durationSeconds,
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

    try {
      const cobalt = await callCobalt(cobaltPayload(body.url, body.quality))
      const upstream = await fetch(cobalt.url, { headers: { 'User-Agent': BROWSER_UA } })
      if (!upstream.ok || !upstream.body) {
        release()
        throw new InternalServerErrorException('Download failed')
      }

      const filename = sanitizeFilename(cobalt.filename ?? `video.${ext}`, `video.${ext}`)
      res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      const contentLength = upstream.headers.get('content-length')
      if (contentLength) res.setHeader('Content-Length', contentLength)

      const reader = upstream.body.getReader()
      const pump = async (): Promise<void> => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (!res.write(value)) {
              await new Promise<void>((resolve) => res.once('drain', resolve))
            }
          }
          res.end()
        } finally {
          release()
        }
      }
      void pump().catch(() => {
        release()
        res.end()
      })
    } catch (err) {
      release()
      if (err instanceof ServiceUnavailableException) throw err
      if (err instanceof ForbiddenException) throw err
      throw new InternalServerErrorException('Download failed')
    }
  }
}
