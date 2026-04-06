import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IGroupRepository } from '../interfaces/group.repository'
import type { IGroup, IGroupMember, IGroupFilters, ICreateGroupData, IUpdateGroupData } from '../interfaces/people.interfaces'

@Injectable()
export class GroupRepository extends IGroupRepository {
  findMany = async (filters: IGroupFilters, tx: TxClient): Promise<IGroup[]> => {
    const rows = await tx.group.findMany({
      where: {
        deletedAt: null,
        ...(filters.createdBy != null && { createdBy: filters.createdBy }),
        ...(filters.search != null && {
          name: { contains: filters.search, mode: 'insensitive' },
        }),
      },
      include: {
        _count: {
          select: { memberships: true },
        },
      },
    })

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      memberCount: row._count.memberships,
    }))
  }

  findById = async (id: string, tx: TxClient): Promise<IGroup | null> => {
    const row = await tx.group.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: { memberships: true },
        },
      },
    })

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      memberCount: row._count.memberships,
    }
  }

  findByIdWithMembers = async (
    id: string,
    tx: TxClient,
  ): Promise<(IGroup & { members: IGroupMember[] }) | null> => {
    const row = await tx.group.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: { memberships: true },
        },
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      memberCount: row._count.memberships,
      members: row.memberships.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.user.role,
        avatarUrl: m.user.avatarUrl,
        joinedAt: m.joinedAt,
      })),
    }
  }

  create = async (data: ICreateGroupData, createdBy: string, tx: TxClient): Promise<IGroup> => {
    const row = await tx.group.create({
      data: {
        name: data.name,
        description: data.description ?? '',
        createdBy,
      },
      include: {
        _count: {
          select: { memberships: true },
        },
      },
    })

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      memberCount: row._count.memberships,
    }
  }

  update = async (id: string, data: IUpdateGroupData, tx: TxClient): Promise<IGroup> => {
    const row = await tx.group.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.description != null && { description: data.description }),
      },
      include: {
        _count: {
          select: { memberships: true },
        },
      },
    })

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      memberCount: row._count.memberships,
    }
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.group.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  addMember = async (groupId: string, userId: string, tx: TxClient): Promise<void> => {
    await tx.groupMembership.create({
      data: { groupId, userId },
    })
  }

  removeMember = async (groupId: string, userId: string, tx: TxClient): Promise<void> => {
    await tx.groupMembership.delete({
      where: { userId_groupId: { userId, groupId } },
    })
  }
}
