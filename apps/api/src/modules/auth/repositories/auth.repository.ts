import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IAuthRepository } from './auth.repository.abstract'
import type { IAuthUser, IAuthUserWithPassword } from '../interfaces/auth.interfaces'

@Injectable()
export class AuthRepository extends IAuthRepository {
  findByEmail = async (email: string, tx: TxClient): Promise<IAuthUserWithPassword | null> => {
    return tx.user.findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        avatarUrl: true,
        password: true,
      },
    })
  }

  findById = async (id: string, tx: TxClient): Promise<IAuthUser | null> => {
    return tx.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        avatarUrl: true,
      },
    })
  }
}
