import { IsIn, IsUrl } from 'class-validator'
import type { VideoQuality } from '../../interfaces/youtube.interfaces'

export class YoutubeDownloadDto {
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  url: string

  @IsIn(['1080p', '720p', '480p', 'audio'])
  quality: VideoQuality
}
