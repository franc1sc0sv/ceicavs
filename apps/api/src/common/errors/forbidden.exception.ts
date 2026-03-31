import { AppException } from './app.exception'

export class ForbiddenException extends AppException {
  constructor() {
    super('Forbidden', 'FORBIDDEN')
  }
}
