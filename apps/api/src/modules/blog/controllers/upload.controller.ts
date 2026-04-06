import { Controller, Post, UseGuards } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'

interface SignatureResponse {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('sign')
  sign(): SignatureResponse {
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'ceicavs/blog-images'

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    )

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      folder,
    }
  }
}
