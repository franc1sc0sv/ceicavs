import { Injectable } from '@nestjs/common'
import { sql } from 'kysely'
import { kysely } from '@ceicavs/db'
import type { TxClient } from '@ceicavs/db'
import { IDashboardRepository } from './dashboard.repository.abstract'
import type {
  IActivityItem,
  IAttendanceDayPoint,
  IAttendanceGroupLine,
  IDashboardPostsByStatus,
  IDashboardUsersByRole,
  IStudentAttendanceDayPoint,
} from '../interfaces/dashboard.interfaces'

interface AttendanceRateRow {
  rate: string | number | null
}

interface AttendanceTrendRow {
  day: string
  rate: string | number | null
}

interface AttendanceGroupTrendRow {
  group_id: string
  group_name: string
  day: string
  rate: string | number | null
}

interface UserRoleCountRow {
  role: string
  count: string | number
}

interface PostStatusCountRow {
  status: string
  count: string | number
}

interface StudentTrendRow {
  day: string
  status: string | null
}

interface ActivityRow {
  id: string
  type: string
  description: string
  actor_name: string
  actor_avatar_url: string | null
  actor_role: string
  entity_id: string | null
  entity_type: string | null
  created_at: Date
}

function toRate(value: string | number | null): number {
  if (value === null) return 0
  const n = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(n) ? 0 : n
}

function toCount(value: string | number): number {
  const n = typeof value === 'string' ? parseInt(value, 10) : value
  return isNaN(n) ? 0 : n
}

@Injectable()
export class DashboardRepository extends IDashboardRepository {
  countActiveUsers = async (tx: TxClient): Promise<number> => {
    return tx.user.count({ where: { deletedAt: null } })
  }

  countActiveGroups = async (tx: TxClient): Promise<number> => {
    return tx.group.count({ where: { deletedAt: null } })
  }

  countPostsByStatusInRange = async (
    from: Date,
    to: Date,
    tx: TxClient,
  ): Promise<IDashboardPostsByStatus> => {
    const groups = await tx.post.groupBy({
      by: ['status'],
      where: {
        deletedAt: null,
        createdAt: { gte: from, lte: to },
      },
      _count: { status: true },
    })

    let published = 0
    let draft = 0
    let rejected = 0

    for (const g of groups) {
      if (g.status === 'published') published = g._count.status
      else if (g.status === 'draft') draft = g._count.status
      else if (g.status === 'rejected') rejected = g._count.status
    }

    return { published, draft, rejected }
  }

  countAllPostsByStatus = async (tx: TxClient): Promise<IDashboardPostsByStatus> => {
    const groups = await tx.post.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { status: true },
    })

    let published = 0
    let draft = 0
    let rejected = 0

    for (const g of groups) {
      if (g.status === 'published') published = g._count.status
      else if (g.status === 'draft') draft = g._count.status
      else if (g.status === 'rejected') rejected = g._count.status
    }

    return { published, draft, rejected }
  }

  computeGlobalAttendanceRateInRange = async (
    from: Date,
    to: Date,
    tx: TxClient,
  ): Promise<number> => {
    const query = kysely
      .selectFrom('attendance_records')
      .select(
        sql<number>`
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            COUNT(*) FILTER (WHERE status IN ('present', 'late'))::numeric / COUNT(*)::numeric * 100,
            2
          )
          END
        `.as('rate'),
      )
      .where('date', '>=', from)
      .where('date', '<=', to)
      .compile()

    const rows = await tx.$queryRawUnsafe<AttendanceRateRow[]>(
      query.sql,
      ...query.parameters,
    )

    return toRate(rows[0]?.rate ?? null)
  }

  countUsersByRole = async (tx: TxClient): Promise<IDashboardUsersByRole> => {
    const query = kysely
      .selectFrom('users')
      .select(['role', sql<number>`COUNT(*)`.as('count')])
      .where('deleted_at', 'is', null)
      .groupBy('role')
      .compile()

    const rows = await tx.$queryRawUnsafe<UserRoleCountRow[]>(
      query.sql,
      ...query.parameters,
    )

    let admin = 0
    let teacher = 0
    let student = 0

    for (const row of rows) {
      if (row.role === 'admin') admin = toCount(row.count)
      else if (row.role === 'teacher') teacher = toCount(row.count)
      else if (row.role === 'student') student = toCount(row.count)
    }

    return { admin, teacher, student }
  }

  computeGlobalAttendanceTrend = async (
    days: number,
    tx: TxClient,
  ): Promise<IAttendanceDayPoint[]> => {
    const query = kysely
      .selectFrom('attendance_records')
      .select([
        sql<string>`DATE(date)::text`.as('day'),
        sql<number>`
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            COUNT(*) FILTER (WHERE status IN ('present', 'late'))::numeric / COUNT(*)::numeric * 100,
            2
          )
          END
        `.as('rate'),
      ])
      .where(
        'date',
        '>=',
        sql<Date>`CURRENT_DATE - ${sql.lit(days)}::int * INTERVAL '1 day'`,
      )
      .groupBy(sql`DATE(date)`)
      .orderBy(sql`DATE(date)`, 'asc')
      .compile()

    const rows = await tx.$queryRawUnsafe<AttendanceTrendRow[]>(
      query.sql,
      ...query.parameters,
    )

    return rows.map((r) => ({ date: r.day, rate: toRate(r.rate) }))
  }

  countGroupsForTeacher = async (userId: string, tx: TxClient): Promise<number> => {
    return tx.group.count({
      where: {
        deletedAt: null,
        OR: [
          { createdBy: userId },
          { memberships: { some: { userId } } },
        ],
      },
    })
  }

  computeTeacherGroupsTodayRate = async (userId: string, tx: TxClient): Promise<number> => {
    const query = kysely
      .selectFrom('attendance_records as ar')
      .innerJoin('group_memberships as gm', 'ar.group_id', 'gm.group_id')
      .innerJoin('groups as g', 'g.id', 'ar.group_id')
      .select(
        sql<number>`
          CASE WHEN COUNT(ar.id) = 0 THEN 0
          ELSE ROUND(
            COUNT(ar.id) FILTER (WHERE ar.status IN ('present', 'late'))::numeric / COUNT(ar.id)::numeric * 100,
            2
          )
          END
        `.as('rate'),
      )
      .where('gm.user_id', '=', userId)
      .where('g.deleted_at', 'is', null)
      .where('ar.date', '=', sql<Date>`CURRENT_DATE`)
      .compile()

    const rows = await tx.$queryRawUnsafe<AttendanceRateRow[]>(
      query.sql,
      ...query.parameters,
    )

    return toRate(rows[0]?.rate ?? null)
  }

  countPostsForUser = async (userId: string, tx: TxClient): Promise<number> => {
    return tx.post.count({ where: { authorId: userId, deletedAt: null } })
  }

  countPendingAttendanceForTeacher = async (userId: string, tx: TxClient): Promise<number> => {
    const query = kysely
      .selectFrom('groups as g')
      .leftJoin('attendance_submissions as sub', (join) =>
        join
          .onRef('sub.group_id', '=', 'g.id')
          .on('sub.date', '=', sql<Date>`CURRENT_DATE`),
      )
      .select(sql<number>`COUNT(g.id) FILTER (WHERE sub.id IS NULL)`.as('count'))
      .where('g.deleted_at', 'is', null)
      .where((eb) =>
        eb.or([
          eb('g.created_by', '=', userId),
          eb.exists(
            eb
              .selectFrom('group_memberships as gm')
              .select('gm.group_id')
              .whereRef('gm.group_id', '=', 'g.id')
              .where('gm.user_id', '=', userId),
          ),
        ]),
      )
      .compile()

    const rows = await tx.$queryRawUnsafe<{ count: string | number }[]>(
      query.sql,
      ...query.parameters,
    )

    return toCount(rows[0]?.count ?? 0)
  }

  computeTeacherGroupAttendanceTrend = async (
    userId: string,
    days: number,
    tx: TxClient,
  ): Promise<IAttendanceGroupLine[]> => {
    const query = kysely
      .selectFrom('attendance_records as ar')
      .innerJoin('groups as g', 'g.id', 'ar.group_id')
      .select([
        'g.id as group_id',
        'g.name as group_name',
        sql<string>`DATE(ar.date)::text`.as('day'),
        sql<number>`
          CASE WHEN COUNT(ar.id) = 0 THEN 0
          ELSE ROUND(
            COUNT(ar.id) FILTER (WHERE ar.status IN ('present', 'late'))::numeric / COUNT(ar.id)::numeric * 100,
            2
          )
          END
        `.as('rate'),
      ])
      .where('g.deleted_at', 'is', null)
      .where(
        'ar.date',
        '>=',
        sql<Date>`CURRENT_DATE - ${sql.lit(days)}::int * INTERVAL '1 day'`,
      )
      .where((eb) =>
        eb.or([
          eb('g.created_by', '=', userId),
          eb.exists(
            eb
              .selectFrom('group_memberships as gm')
              .select('gm.group_id')
              .whereRef('gm.group_id', '=', 'g.id')
              .where('gm.user_id', '=', userId),
          ),
        ]),
      )
      .groupBy(['g.id', 'g.name', sql`DATE(ar.date)`])
      .orderBy('g.id', 'asc')
      .orderBy(sql`DATE(ar.date)`, 'asc')
      .compile()

    const rows = await tx.$queryRawUnsafe<AttendanceGroupTrendRow[]>(
      query.sql,
      ...query.parameters,
    )

    const lineMap = new Map<string, IAttendanceGroupLine>()

    for (const row of rows) {
      if (!lineMap.has(row.group_id)) {
        lineMap.set(row.group_id, {
          groupId: row.group_id,
          groupName: row.group_name,
          points: [],
        })
      }
      lineMap.get(row.group_id)!.points.push({ date: row.day, rate: toRate(row.rate) })
    }

    return Array.from(lineMap.values())
  }

  countPostsByStatusForUser = async (
    userId: string,
    tx: TxClient,
  ): Promise<IDashboardPostsByStatus> => {
    const groups = await tx.post.groupBy({
      by: ['status'],
      where: { authorId: userId, deletedAt: null },
      _count: { status: true },
    })

    let published = 0
    let draft = 0
    let rejected = 0

    for (const g of groups) {
      if (g.status === 'published') published = g._count.status
      else if (g.status === 'draft') draft = g._count.status
      else if (g.status === 'rejected') rejected = g._count.status
    }

    return { published, draft, rejected }
  }

  computeStudentAttendanceRate = async (userId: string, tx: TxClient): Promise<number> => {
    const query = kysely
      .selectFrom('attendance_records')
      .select(
        sql<number>`
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            COUNT(*) FILTER (WHERE status IN ('present', 'late'))::numeric / COUNT(*)::numeric * 100,
            2
          )
          END
        `.as('rate'),
      )
      .where('user_id', '=', userId)
      .compile()

    const rows = await tx.$queryRawUnsafe<AttendanceRateRow[]>(
      query.sql,
      ...query.parameters,
    )

    return toRate(rows[0]?.rate ?? null)
  }

  computeStudentStreak = async (userId: string, tx: TxClient): Promise<number> => {
    const records = await tx.attendanceRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { status: true },
    })

    let streak = 0
    for (const record of records) {
      if (record.status === 'present' || record.status === 'late') {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  countDraftsForUser = async (userId: string, tx: TxClient): Promise<number> => {
    return tx.post.count({ where: { authorId: userId, status: 'draft', deletedAt: null } })
  }

  countGroupMemberships = async (userId: string, tx: TxClient): Promise<number> => {
    return tx.groupMembership.count({ where: { userId } })
  }

  computeStudentAttendanceTrend = async (
    userId: string,
    days: number,
    tx: TxClient,
  ): Promise<IStudentAttendanceDayPoint[]> => {
    const query = kysely
      .selectFrom('attendance_records')
      .select([
        sql<string>`DATE(date)::text`.as('day'),
        'status',
      ])
      .where('user_id', '=', userId)
      .where(
        'date',
        '>=',
        sql<Date>`CURRENT_DATE - ${sql.lit(days)}::int * INTERVAL '1 day'`,
      )
      .orderBy(sql`DATE(date)`, 'asc')
      .compile()

    const rows = await tx.$queryRawUnsafe<StudentTrendRow[]>(
      query.sql,
      ...query.parameters,
    )

    return rows.map((r) => ({ date: r.day, status: r.status }))
  }

  findRecentActivityAll = async (limit: number, tx: TxClient): Promise<IActivityItem[]> => {
    const activities = await tx.activity.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { name: true, avatarUrl: true } } },
    })

    return activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      actorName: a.actor.name,
      actorAvatarUrl: a.actor.avatarUrl ?? null,
      actorRole: a.actorRole,
      entityId: a.entityId ?? null,
      entityType: a.entityType ?? null,
      createdAt: a.createdAt,
    }))
  }

  findRecentActivityForTeacher = async (
    userId: string,
    limit: number,
    tx: TxClient,
  ): Promise<IActivityItem[]> => {
    const query = kysely
      .selectFrom('activities as a')
      .innerJoin('users as u', 'u.id', 'a.actor_id')
      .select([
        'a.id',
        'a.type',
        'a.description',
        'u.name as actor_name',
        'u.avatar_url as actor_avatar_url',
        'a.actor_role',
        'a.entity_id',
        'a.entity_type',
        'a.created_at',
      ])
      .where((eb) =>
        eb.or([
          eb('a.actor_id', '=', userId),
          eb.exists(
            eb
              .selectFrom('group_memberships as gm')
              .select('gm.group_id')
              .where('gm.user_id', '=', userId)
              .where(
                'a.entity_id',
                '=',
                sql<string>`gm.group_id`,
              ),
          ),
        ]),
      )
      .orderBy('a.created_at', 'desc')
      .limit(limit)
      .compile()

    const rows = await tx.$queryRawUnsafe<ActivityRow[]>(
      query.sql,
      ...query.parameters,
    )

    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      description: r.description,
      actorName: r.actor_name,
      actorAvatarUrl: r.actor_avatar_url ?? null,
      actorRole: r.actor_role,
      entityId: r.entity_id ?? null,
      entityType: r.entity_type ?? null,
      createdAt: r.created_at,
    }))
  }

  findRecentActivityForUser = async (
    userId: string,
    limit: number,
    tx: TxClient,
  ): Promise<IActivityItem[]> => {
    const activities = await tx.activity.findMany({
      where: { actorId: userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { name: true, avatarUrl: true } } },
    })

    return activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      actorName: a.actor.name,
      actorAvatarUrl: a.actor.avatarUrl ?? null,
      actorRole: a.actorRole,
      entityId: a.entityId ?? null,
      entityType: a.entityType ?? null,
      createdAt: a.createdAt,
    }))
  }
}
