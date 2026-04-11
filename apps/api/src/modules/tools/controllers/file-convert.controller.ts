import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request, Response } from 'express'
import mammoth from 'mammoth'
import puppeteer from 'puppeteer'
import { PDFParse } from 'pdf-parse'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { JwtRestAuthGuard } from '../../../common/guards/jwt-rest-auth.guard'
import { ForbiddenException } from '../../../common/errors'
import type { IJwtUser } from '../../../common/types'
import { FileConvertDto } from './dto/file-convert.dto'

interface AuthenticatedRequest extends Request {
  user: IJwtUser
}

@Controller('tools')
@UseGuards(JwtRestAuthGuard)
export class FileConvertController {
  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convert(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Query() query: FileConvertDto,
    @Res() res: Response,
  ): Promise<void> {
    const ability = defineAbilityFor(req.user.role)
    if (!ability.can(Action.READ, Subject.TOOL)) {
      throw new ForbiddenException()
    }

    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    const baseName = file.originalname.replace(/\.[^.]+$/, '')

    if (query.direction === 'word-to-pdf') {
      await this.convertWordToPdf(file, baseName, res)
    } else {
      await this.convertPdfToWord(file, baseName, res)
    }
  }

  private async convertWordToPdf(
    file: Express.Multer.File,
    baseName: string,
    res: Response,
  ): Promise<void> {
    const { value: html } = await mammoth.convertToHtml({ buffer: file.buffer })

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      const pdf = await page.pdf({ format: 'A4' })

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${baseName}.pdf"`,
      )
      res.end(pdf)
    } finally {
      await browser.close()
    }
  }

  private async convertPdfToWord(
    file: Express.Multer.File,
    baseName: string,
    res: Response,
  ): Promise<void> {
    const parser = new PDFParse({ data: file.buffer })
    const result = await parser.getText()

    const paragraphs = result.text
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => new Paragraph({ children: [new TextRun(line)] }))

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    })

    const buffer = await Packer.toBuffer(doc)

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${baseName}.docx"`,
    )
    res.end(buffer)
  }
}
