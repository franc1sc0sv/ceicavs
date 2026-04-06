import { useTranslation } from 'react-i18next'

interface Category {
  id: string
  name: string
}

interface CategoryChipsProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  const { t } = useTranslation('blog')

  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={t('filters.allCategories')}>
      <button
        onClick={() => onSelect(null)}
        aria-pressed={!selectedId}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          !selectedId
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        {t('filters.allCategories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(selectedId === cat.id ? null : cat.id)}
          aria-pressed={selectedId === cat.id}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            selectedId === cat.id
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
