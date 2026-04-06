import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { AttendanceStatus } from '../enums/attendance-status.enum'
import { IAttendanceRepository } from './attendance.repository.abstract'
import type {
  IAttendanceGroup,
  IGroupRoster,
  IRecordAttendanceItem,
  IStudentHistoryRecord,
  IStudentReport,
  IStudentSummary,
} from '../interfaces/attendance.interfaces'

@Injectable()
export class AttendanceRepository extends IAttendanceRepository {
  findGroupsForAdmin = async (tx: TxClient): Promise<IAttendanceGroup[]> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const groups = await tx.group.findMany({
      where: { deletedAt: null },
      include: {
        _count: { select: { memberships: true } },
        attendanceSubmissions: {
          where: { date: today },
          select: { id: true },
        },
        attendanceRecords: {
          where: { date: today },
          select: { status: true },
        },
      },
    })

    return groups.map((group) => {
      const todaySubmitted = group.attendanceSubmissions.length > 0
      const memberCount = group._count.memberships
      const presentCount = group.attendanceRecords.filter(
        (r) => r.status === AttendanceStatus.present || r.status === AttendanceStatus.late,
      ).length
      const todayRate = todaySubmitted && memberCount > 0 ? Math.round((presentCount / memberCount) * 100) : null

      return {
        id: group.id,
        name: group.name,
        memberCount,
        todayRate,
        todaySubmitted,
      }
    })
  }

  findGroupsForTeacher = async (userId: string, tx: TxClient): Promise<IAttendanceGroup[]> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const groups = await tx.group.findMany({
      where: {
        deletedAt: null,
        OR: [
          { createdBy: userId },
          { memberships: { some: { userId } } },
        ],
      },
      include: {
        _count: { select: { memberships: true } },
        attendanceSubmissions: {
          where: { date: today },
          select: { id: true },
        },
        attendanceRecords: {
          where: { date: today },
          select: { status: true },
        },
      },
    })

    return groups.map((group) => {
      const todaySubmitted = group.attendanceSubmissions.length > 0
      const memberCount = group._count.memberships
      const presentCount = group.attendanceRecords.filter(
        (r) => r.status === AttendanceStatus.present || r.status === AttendanceStatus.late,
      ).length
      const todayRate = todaySubmitted && memberCount > 0 ? Math.round((presentCount / memberCount) * 100) : null

      return {
        id: group.id,
        name: group.name,
        memberCount,
        todayRate,
        todaySubmitted,
      }
    })
  }

  findRoster = async (groupId: string, date: string, tx: TxClient): Promise<IGroupRoster> => {
    const group = await tx.group.findFirst({
      where: { id: groupId, deletedAt: null },
      select: {
        id: true,
        name: true,
        _count: { select: { memberships: true } },
        attendanceSubmissions: {
          where: { date: new Date(date) },
          select: { id: true },
        },
        attendanceRecords: {
          where: { date: new Date(date) },
          select: { status: true },
        },
      },
    })

    const memberships = await tx.groupMembership.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            deletedAt: true,
            attendanceRecords: {
              where: { groupId, date: new Date(date) },
              select: { status: true },
            },
          },
        },
      },
    })

    const roster = memberships
      .filter((m) => m.user.deletedAt === null)
      .map((m) => ({
        id: m.user.id,
        name: m.user.name,
        avatarUrl: m.user.avatarUrl,
        status: m.user.attendanceRecords[0]?.status ?? null,
      }))

    const groupData: IGroupRoster['group'] = group
      ? (() => {
          const todaySubmitted = group.attendanceSubmissions.length > 0
          const memberCount = group._count.memberships
          const presentCount = group.attendanceRecords.filter(
            (r) => r.status === AttendanceStatus.present || r.status === AttendanceStatus.late,
          ).length
          const todayRate = todaySubmitted && memberCount > 0 ? Math.round((presentCount / memberCount) * 100) : null
          return { id: group.id, name: group.name, memberCount, todaySubmitted, todayRate }
        })()
      : { id: groupId, name: '', memberCount: 0, todaySubmitted: false, todayRate: null }

    return { group: groupData, date, roster }
  }

  findAttendanceReport = async (
    groupId: string,
    dateRange: { from: Date; to: Date },
    tx: TxClient,
  ): Promise<IStudentReport[]> => {
    const memberships = await tx.groupMembership.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            deletedAt: true,
            attendanceRecords: {
              where: {
                groupId,
                date: { gte: dateRange.from, lte: dateRange.to },
              },
              select: { status: true },
            },
          },
        },
      },
    })

    return memberships
      .filter((m) => m.user.deletedAt === null)
      .map((m) => {
        const records = m.user.attendanceRecords
        const totalDays = records.length
        const presentCount = records.filter((r) => r.status === AttendanceStatus.present).length
        const absentCount = records.filter((r) => r.status === AttendanceStatus.absent).length
        const lateCount = records.filter((r) => r.status === AttendanceStatus.late).length
        const excusedCount = records.filter((r) => r.status === AttendanceStatus.excused).length
        const attendedCount = presentCount + lateCount
        const attendanceRate = totalDays > 0 ? attendedCount / totalDays : 0

        return {
          studentId: m.user.id,
          studentName: m.user.name,
          attendanceRate,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          totalDays,
        }
      })
  }

  findStudentHistory = async (userId: string, tx: TxClient): Promise<IStudentHistoryRecord[]> => {
    const records = await tx.attendanceRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        status: true,
        group: { select: { name: true } },
      },
    })

    return records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      groupName: r.group.name,
      status: r.status,
    }))
  }

  findStudentSummary = async (userId: string, tx: TxClient): Promise<IStudentSummary> => {
    const records = await tx.attendanceRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true, status: true, groupId: true },
    })

    const totalDays = records.length
    const attendedCount = records.filter(
      (r) => r.status === AttendanceStatus.present || r.status === AttendanceStatus.late,
    ).length
    const overallRate = totalDays > 0 ? attendedCount / totalDays : 0

    const uniqueGroups = new Set(records.map((r) => r.groupId))
    const groupCount = uniqueGroups.size

    let currentStreak = 0
    for (const record of records) {
      if (record.status === AttendanceStatus.present || record.status === AttendanceStatus.late) {
        currentStreak++
      } else {
        break
      }
    }

    return { overallRate, currentStreak, groupCount }
  }

  upsertAttendanceRecords = async (
    groupId: string,
    date: string,
    records: IRecordAttendanceItem[],
    tx: TxClient,
  ): Promise<void> => {
    const parsedDate = new Date(date)

    await Promise.all(
      records.map((record) =>
        tx.attendanceRecord.upsert({
          where: {
            userId_groupId_date: {
              userId: record.studentId,
              groupId,
              date: parsedDate,
            },
          },
          create: {
            userId: record.studentId,
            groupId,
            date: parsedDate,
            status: record.status,
          },
          update: { status: record.status },
        }),
      ),
    )
  }

  upsertSubmission = async (
    groupId: string,
    submittedBy: string,
    date: string,
    tx: TxClient,
  ): Promise<void> => {
    const parsedDate = new Date(date)

    await tx.attendanceSubmission.upsert({
      where: {
        groupId_date: { groupId, date: parsedDate },
      },
      create: { groupId, submittedBy, date: parsedDate },
      update: { submittedBy, submittedAt: new Date() },
    })
  }
}
