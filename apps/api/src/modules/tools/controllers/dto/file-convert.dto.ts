import { IsIn } from 'class-validator'

export type ConvertDirection = 'word-to-pdf' | 'pdf-to-word'

export class FileConvertDto {
  @IsIn(['word-to-pdf', 'pdf-to-word'])
  direction: ConvertDirection
}
