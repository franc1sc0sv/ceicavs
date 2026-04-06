import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Pencil, Trash2, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategories } from '../hooks/use-categories'

export function CategoryManagementPage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, creating, updating, deleting } =
    useCategories()

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Cargando" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('error.title')}</p>
      </div>
    )
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!newName.trim()) return
    await createCategory({ variables: { name: newName.trim() } })
    setNewName('')
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return
    await updateCategory({ variables: { id, name: editingName.trim() } })
    setEditingId(null)
    setEditingName('')
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id)
    setEditingName(currentName)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pages.categories')}</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="gap-1.5">
          {t('actions.back')}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t('categories.addCategory')}
          disabled={creating}
          aria-label={t('categories.addCategory')}
        />
        <Button type="submit" disabled={!newName.trim() || creating}>
          {t('actions.add')}
        </Button>
      </form>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('empty.noCategories')}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm" aria-label={t('pages.categories')}>
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  {t('categories.name')}
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 w-24">
                  {t('categories.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(categories as { id: string; name: string }[]).map((cat: { id: string; name: string }) => (
                <tr key={cat.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 text-sm"
                        aria-label={t('categories.name')}
                        autoFocus
                      />
                    ) : (
                      <span className="text-slate-900 dark:text-slate-100 font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === cat.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updating}
                            onClick={() => handleUpdate(cat.id)}
                            aria-label={t('actions.save')}
                            className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            aria-label={t('delete.cancel')}
                            className="h-7 w-7 p-0 text-slate-400"
                          >
                            <X className="size-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(cat.id, cat.name)}
                            aria-label={`${t('actions.edit')} ${cat.name}`}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={deleting}
                            onClick={() => deleteCategory({ variables: { id: cat.id } })}
                            aria-label={`${t('actions.delete')} ${cat.name}`}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CategoryManagementPage
