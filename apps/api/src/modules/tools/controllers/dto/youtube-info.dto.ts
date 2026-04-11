import { IsUrl } from 'class-validator'

export class YoutubeInfoDto {
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  url: string
}
