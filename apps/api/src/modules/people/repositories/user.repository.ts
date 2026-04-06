import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import type { TxClient } from '@ceicavs/db'
import type { UserRole } from '@ceicavs/shared'
import { IUserRepository } from '../interfaces/user.repository'
import type { IUser, IUserFilters, ICreateUserData, IUpdateUserData } from '../interfaces/people.interfaces'

@Injectable()
export class UserRepository extends IUserRepository {
  findMany = async (filters: IUserFilters, tx: TxClient): Promise<IUser[]> => {
    const where: NonNullable<Parameters<typeof tx.user.findMany>[0]>['where'] = filters.isDeactivated
      ? { deletedAt: { not: null } }
      : { deletedAt: null }

    if (filters.role != null) {
      where.role = filters.role
    }

    if (filters.search != null) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.groupId != null) {
      where.groupMemberships = {
        some: { groupId: filters.groupId },
      }
    }

    const rows = await tx.user.findMany({
      where,
      include: {
        groupMemberships: {
          include: {
            group: {
              select: { id: true, name: true },
            },
          },
          where: {
            group: { deletedAt: null },
          },
        },
      },
    })

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
      groups: row.groupMemberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
      })),
    }))
  }

  findById = async (id: string, tx: TxClient): Promise<IUser | null> => {
    const row = await tx.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        groupMemberships: {
          include: {
            group: {
              select: { id: true, name: true },
            },
          },
          where: {
            group: { deletedAt: null },
          },
        },
      },
    })

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
      groups: row.groupMemberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
      })),
    }
  }

  create = async (data: ICreateUserData, tx: TxClient): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const row = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    })

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
      groups: [],
    }
  }

  update = async (id: string, data: IUpdateUserData, tx: TxClient): Promise<IUser> => {
    const row = await tx.user.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.email != null && { email: data.email }),
        ...(data.role != null && { role: data.role }),
      },
      include: {
        groupMemberships: {
          include: {
            group: {
              select: { id: true, name: true },
            },
          },
          where: {
            group: { deletedAt: null },
          },
        },
      },
    })

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
      groups: row.groupMemberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
      })),
    }
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  softDeleteMany = async (ids: string[], tx: TxClient): Promise<void> => {
    await tx.user.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
  }

  updateRole = async (id: string, role: UserRole, tx: TxClient): Promise<IUser> => {
    const row = await tx.user.update({
      where: { id },
      data: { role },
    })

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt,
    }
  }

  updateRoleMany = async (ids: string[], role: UserRole, tx: TxClient): Promise<void> => {
    await tx.user.updateMany({
      where: { id: { in: ids } },
      data: { role },
    })
  }
}
