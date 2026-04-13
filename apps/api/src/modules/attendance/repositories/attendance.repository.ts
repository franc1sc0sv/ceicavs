import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { AttendanceStatus } from '../enums/attendance-status.enum'
import { IAttendanceRepository } from './attendance.repository.abstract'
import type {
  IAttendanceGroup,
  IAttendanceReportResult,
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
          where: { date: new Date(date + 'T00:00:00Z') },
          select: { id: true },
        },
        attendanceRecords: {
          where: { date: new Date(date + 'T00:00:00Z') },
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
              where: { groupId, date: new Date(date + 'T00:00:00Z') },
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

    const periodDays =
      Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))

    return memberships
      .filter((m) => m.user.deletedAt === null)
      .map((m) => {
        const records = m.user.attendanceRecords
        const presentCount = records.filter((r) => r.status === AttendanceStatus.present).length
        const absentCount = records.filter((r) => r.status === AttendanceStatus.absent).length
        const lateCount = records.filter((r) => r.status === AttendanceStatus.late).length
        const excusedCount = records.filter((r) => r.status === AttendanceStatus.excused).length
        const attendedCount = presentCount + lateCount
        const attendanceRate = Math.round((attendedCount / periodDays) * 10000) / 100

        return {
          studentId: m.user.id,
          studentName: m.user.name,
          attendanceRate,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          totalDays: periodDays,
        }
      })
  }

  findAttendanceReportByRange = async (
    groupId: string,
    dateFrom: string,
    dateTo: string,
    studentIds: string[] | null,
    tx: TxClient,
  ): Promise<IAttendanceReportResult> => {
    const group = await tx.group.findUniqueOrThrow({
      where: { id: groupId },
      select: { name: true },
    })

    const memberships = await tx.groupMembership.findMany({
      where: {
        groupId,
        ...(studentIds !== null ? { userId: { in: studentIds } } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, deletedAt: true },
        },
      },
    })

    const records = await tx.attendanceRecord.findMany({
      where: {
        groupId,
        date: { gte: new Date(dateFrom + 'T00:00:00Z'), lte: new Date(dateTo + 'T23:59:59.999Z') },
        ...(studentIds !== null ? { userId: { in: studentIds } } : {}),
      },
    })

    const recordsByUserId = new Map<string, typeof records>()
    for (const record of records) {
      const existing = recordsByUserId.get(record.userId) ?? []
      existing.push(record)
      recordsByUserId.set(record.userId, existing)
    }

    const periodDays =
      Math.round((new Date(dateTo + 'T00:00:00Z').getTime() - new Date(dateFrom + 'T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) + 1

    const students: IStudentReport[] = memberships
      .filter((m) => m.user.deletedAt === null)
      .map((m) => {
        const userRecords = recordsByUserId.get(m.user.id) ?? []
        const presentCount = userRecords.filter((r) => r.status === AttendanceStatus.present).length
        const absentCount = userRecords.filter((r) => r.status === AttendanceStatus.absent).length
        const lateCount = userRecords.filter((r) => r.status === AttendanceStatus.late).length
        const excusedCount = userRecords.filter((r) => r.status === AttendanceStatus.excused).length
        const attendedCount = presentCount + lateCount
        const attendanceRate = Math.round((attendedCount / periodDays) * 10000) / 100

        return {
          studentId: m.user.id,
          studentName: m.user.name,
          attendanceRate,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          totalDays: periodDays,
        }
      })

    const distinctDates = new Set(records.map((r) => r.date.toISOString().split('T')[0]))
    const totalSessions = distinctDates.size
    const totalStudents = memberships.length
    const totalPresent = students.reduce((sum, s) => sum + s.presentCount, 0)
    const totalAbsent = students.reduce((sum, s) => sum + s.absentCount, 0)
    const totalLate = students.reduce((sum, s) => sum + s.lateCount, 0)
    const totalExcused = students.reduce((sum, s) => sum + s.excusedCount, 0)
    const averageRate =
      totalStudents > 0
        ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents)
        : 0

    return {
      groupId,
      groupName: group.name,
      dateFrom,
      dateTo,
      summary: {
        totalStudents,
        averageRate,
        totalPresent,
        totalAbsent,
        totalLate,
        totalExcused,
        totalSessions,
      },
      students,
    }
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
    const parsedDate = new Date(date + 'T00:00:00Z')

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
    const parsedDate = new Date(date + 'T00:00:00Z')

    await tx.attendanceSubmission.upsert({
      where: {
        groupId_date: { groupId, date: parsedDate },
      },
      create: { groupId, submittedBy, date: parsedDate },
      update: { submittedBy, submittedAt: new Date() },
    })
  }
}
