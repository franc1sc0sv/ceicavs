'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import type { PeopleManagementProps, UserRole } from '../types'
import { UserTableRow } from './UserTableRow'
import { AddUserModal } from './AddUserModal'

// ── helpers ────────────────────────────────────────────────────────────────

function roleBadge(role: UserRole) {
  if (role === 'admin')   return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
  if (role === 'teacher') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin:   'Admin',
  teacher: 'Docente',
  student: 'Estudiante',
}

// ── DeleteConfirmDialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  count,
  onCancel,
  onConfirm,
}: {
  count: number
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {count === 1 ? 'Eliminar usuario' : `Eliminar ${count} usuarios`}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Esta acción no se puede deshacer.{' '}
              {count === 1 ? 'El usuario será eliminado' : 'Los usuarios serán eliminados'}{' '}
              permanentemente de la plataforma.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── IndeterminateCheckbox ──────────────────────────────────────────────────

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
    />
  )
}

// ── PeopleList ─────────────────────────────────────────────────────────────

export function PeopleList({
  users,
  groups,
  roles,
  permissions,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onBulkDeleteUsers,
  onBulkUpdateUsers,
}: PeopleManagementProps) {
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState<'all' | UserRole>('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [showAdd, setShowAdd]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  // ── derived state ──────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (groupFilter !== 'all' && !u.groups.some(g => g.id === groupFilter)) return false
      return true
    })
  }, [users, search, roleFilter, groupFilter])

  const stats = useMemo(() => ({
    total:    users.length,
    admins:   users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
  }), [users])

  const allSelected  = filtered.length > 0 && selected.size === filtered.length
  const someSelected = selected.size > 0 && selected.size < filtered.length

  // ── handlers ───────────────────────────────────────────────────────────

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(
      allSelected
        ? new Set()
        : new Set(filtered.map(u => u.id))
    )
  }

  function confirmDeleteSingle() {
    if (!deleteTarget) return
    onDeleteUser?.(deleteTarget)
    setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget); return n })
    setDeleteTarget(null)
  }

  function confirmBulkDelete() {
    onBulkDeleteUsers?.([...selected])
    setSelected(new Set())
    setShowBulkDelete(false)
  }

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Personas
            </h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2">
              <span className="text-sm text-slate-400 dark:text-slate-500">
                {stats.total} usuarios
              </span>
              <span className="text-slate-200 dark:text-slate-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge('admin')}`}>
                  {stats.admins} admin
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge('teacher')}`}>
                  {stats.teachers} docentes
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge('student')}`}>
                  {stats.students} estudiantes
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40 transition-all self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar usuario
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
            {(['all', 'admin', 'teacher', 'student'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {r === 'all' ? 'Todos' : ROLE_LABELS[r as UserRole]}
              </button>
            ))}
          </div>

          {/* Group filter */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shrink-0"
          >
            <option value="all">Todos los grupos</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">

          {filtered.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {search || roleFilter !== 'all' || groupFilter !== 'all'
                  ? 'No se encontraron usuarios'
                  : 'Aún no hay usuarios'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {search || roleFilter !== 'all' || groupFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando el primer usuario a la plataforma'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                    <th className="w-12 px-4 py-3">
                      <IndeterminateCheckbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Grupos
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="w-10 px-3 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                  {filtered.map(user => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      isSelected={selected.has(user.id)}
                      onToggle={() => toggleSelect(user.id)}
                      onEdit={() => onUpdateUser?.(user.id, {})}
                      onDelete={() => setDeleteTarget(user.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Result count */}
        {filtered.length > 0 && (
          <p className="mt-3 text-xs text-slate-400 text-right">
            {filtered.length < users.length
              ? `${filtered.length} de ${users.length} usuarios`
              : `${users.length} usuarios en total`}
          </p>
        )}
      </div>

      {/* ── Bulk toolbar ── */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white shadow-2xl shadow-slate-900/30 dark:shadow-slate-100/30 border border-slate-700/60 dark:border-slate-200/60">
          <span className="text-sm font-semibold text-white dark:text-slate-900 tabular-nums">
            {selected.size}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500 mr-1">
            {selected.size === 1 ? 'seleccionado' : 'seleccionados'}
          </span>
          <div className="w-px h-4 bg-slate-700 dark:bg-slate-200" />
          <button
            onClick={() => onBulkUpdateUsers?.([...selected], {})}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-200 dark:text-slate-600 hover:bg-slate-700/60 dark:hover:bg-slate-100 transition-colors"
          >
            Cambiar rol
          </button>
          <button
            onClick={() => setShowBulkDelete(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-400 dark:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Eliminar
          </button>
          <div className="w-px h-4 bg-slate-700 dark:bg-slate-200" />
          <button
            onClick={() => setSelected(new Set())}
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-700/60 dark:hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      {showAdd && (
        <AddUserModal
          roles={roles}
          groups={groups}
          onClose={() => setShowAdd(false)}
          onSave={user => { onCreateUser?.(user); setShowAdd(false) }}
        />
      )}
      {deleteTarget !== null && (
        <DeleteConfirmDialog
          count={1}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteSingle}
        />
      )}
      {showBulkDelete && (
        <DeleteConfirmDialog
          count={selected.size}
          onCancel={() => setShowBulkDelete(false)}
          onConfirm={confirmBulkDelete}
        />
      )}
    </div>
  )
}
