'use client'

import { useState, useRef, useEffect } from 'react'
import type { User, UserRole } from '../types'

// ── helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function roleBadge(role: UserRole) {
  if (role === 'admin')   return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
  if (role === 'teacher') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'
}

function avatarBg(role: UserRole) {
  if (role === 'admin')   return 'bg-indigo-600'
  if (role === 'teacher') return 'bg-amber-500'
  return 'bg-slate-500'
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin:   'Admin',
  teacher: 'Docente',
  student: 'Estudiante',
}

// ── component ─────────────────────────────────────────────────────────────

export interface UserTableRowProps {
  user: User
  isSelected: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function UserTableRow({ user, isSelected, onToggle, onEdit, onDelete }: UserTableRowProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const joinDate = new Date(user.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <tr
      className={`group transition-colors ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-500/10'
          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
      }`}
    >
      {/* Checkbox */}
      <td className="w-12 px-4 py-3.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
        />
      </td>

      {/* User */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full ${avatarBg(user.role)} flex items-center justify-center text-[11px] font-bold text-white select-none`}
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="hidden sm:table-cell px-4 py-3.5">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge(user.role)}`}>
          {ROLE_LABELS[user.role]}
        </span>
      </td>

      {/* Groups */}
      <td className="hidden md:table-cell px-4 py-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {user.groups.length === 0 ? (
            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
          ) : user.groups.length <= 2 ? (
            user.groups.map(g => (
              <span
                key={g.id}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                {g.name}
              </span>
            ))
          ) : (
            <>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium">
                {user.groups[0].name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-medium">
                +{user.groups.length - 1}
              </span>
            </>
          )}
        </div>
      </td>

      {/* Joined */}
      <td className="hidden lg:table-cell px-4 py-3.5">
        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">{joinDate}</span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3.5 w-10">
        <div className="relative flex items-center justify-end" ref={menuRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className={`p-1.5 rounded-lg text-slate-400 transition-all ${
              open
                ? 'opacity-100 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200'
                : 'opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="3" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="8" cy="13" r="1.2" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-9 w-36 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 z-20 overflow-hidden py-1">
              <button
                onClick={() => { onEdit(); setOpen(false) }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => { onDelete(); setOpen(false) }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
