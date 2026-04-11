export type VideoQuality = '1080p' | '720p' | '480p' | 'audio'

export interface IVideoInfo {
  title: string
  thumbnail: string
  durationSeconds: number
}

export interface IYtDlpRawInfo {
  title?: string
  thumbnail?: string
  duration?: number
}
