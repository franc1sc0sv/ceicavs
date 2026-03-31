'use client'

import { useState } from 'react'
import type { User, UserRole, Role, Group } from '../types'

// ── types ──────────────────────────────────────────────────────────────────

export interface AddUserModalProps {
  roles: Role[]
  groups: Group[]
  onClose: () => void
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void
}

// ── helpers ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  admin:   'Admin',
  teacher: 'Docente',
  student: 'Estudiante',
}

// ── component ─────────────────────────────────────────────────────────────

export function AddUserModal({ roles, groups, onClose, onSave }: AddUserModalProps) {
  const defaultRoleId = roles.find(r => r.name === 'student')?.id ?? ''

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    role:     'student' as UserRole,
    roleId:   defaultRoleId,
    groupIds: [] as string[],
  })

  function handleRoleChange(roleName: UserRole) {
    const found = roles.find(r => r.name === roleName)
    setForm(f => ({ ...f, role: roleName, roleId: found?.id ?? '' }))
  }

  function toggleGroup(id: string) {
    setForm(f => ({
      ...f,
      groupIds: f.groupIds.includes(id)
        ? f.groupIds.filter(g => g !== id)
        : [...f.groupIds, id],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      name:   form.name,
      email:  form.email,
      role:   form.role,
      roleId: form.roleId,
      groups: groups
        .filter(g => form.groupIds.includes(g.id))
        .map(g => ({ id: g.id, name: g.name })),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Agregar usuario
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Completa la información del nuevo usuario</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: María García"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="usuario@ceicavs.edu"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Rol
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {(['admin', 'teacher', 'student'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    form.role === r
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Grupos{' '}
              <span className="normal-case font-normal text-slate-300 dark:text-slate-600">
                (opcional)
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-12 max-h-28 overflow-y-auto">
              {groups.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGroup(g.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    form.groupIds.includes(g.id)
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 pb-1 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
