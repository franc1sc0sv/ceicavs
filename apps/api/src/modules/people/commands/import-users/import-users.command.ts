import type { IJwtUser } from '../../../../common/types'
import type { IImportUserRow } from '../../interfaces/people.interfaces'

export class ImportUsersCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly rows: IImportUserRow[],
  ) {}
}
