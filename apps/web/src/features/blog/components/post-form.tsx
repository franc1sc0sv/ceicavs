import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAbility } from '@/context/ability.context'
import { Action, Subject } from '@ceicavs/shared'
import { getApiBase, getAuthHeaders } from '@/lib/api-client'
import { useCategories } from '../hooks/use-categories'

interface PostImageItem {
  url: string
  publicId: string
  order: number
}

interface CloudinarySignResponse {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

interface PostFormValues {
  title: string
  excerpt: string
  content: string
  categoryIds: string[]
  images: { url: string; publicId: string; order: number }[]
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>
  onSubmit: (values: PostFormValues, asDraft: boolean) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

export function PostForm({ initialValues, onSubmit, onCancel, submitting }: PostFormProps) {
  const { t } = useTranslation('blog')
  const ability = useAbility()

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialValues?.categoryIds ?? [])
  const [images, setImages] = useState<PostImageItem[]>(initialValues?.images ?? [])
  const [uploading, setUploading] = useState(false)

  const { categories } = useCategories()
  const canPublish = ability.can(Action.PUBLISH, Subject.POST)

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  async function uploadImages(files: FileList) {
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const signRes = await fetch(`${getApiBase()}/upload/sign`, {
          method: 'POST',
          headers: getAuthHeaders(),
        })
        const { signature, timestamp, apiKey, cloudName, folder } =
          (await signRes.json()) as CloudinarySignResponse

        const formData = new FormData()
        formData.append('file', file)
        formData.append('signature', signature)
        formData.append('timestamp', String(timestamp))
        formData.append('api_key', apiKey)
        formData.append('folder', folder)

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData },
        )
        const uploadData = (await uploadRes.json()) as CloudinaryUploadResponse

        setImages((prev) => [
          ...prev,
          {
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            order: prev.length,
          },
        ])
      }
    } finally {
      setUploading(false)
    }
  }

  const values: PostFormValues = {
    title,
    excerpt,
    content: content
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => `<p>${p}</p>`)
      .join(''),
    categoryIds,
    images: images.map(({ url, publicId, order }) => ({ url, publicId, order })),
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values, false)
      }}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="post-title">{t('form.title')}</Label>
        <Input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-excerpt">{t('form.excerpt')}</Label>
        <textarea
          id="post-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          disabled={submitting}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-content">{t('form.content')}</Label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          disabled={submitting}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('form.images')}
        </span>

        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={img.publicId} className="relative group">
                <img
                  src={img.url}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) =>
                      prev
                        .filter((_, i) => i !== idx)
                        .map((item, i) => ({ ...item, order: i })),
                    )
                  }
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label={t('images.remove')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            uploading
              ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-700 dark:bg-indigo-950/30'
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading || submitting}
            onChange={(e) => e.target.files && uploadImages(e.target.files)}
          />
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {uploading ? t('images.uploading') : t('images.upload')}
          </span>
        </label>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('form.categories')}
          </span>
          <div className="flex flex-wrap gap-2">
            {(categories as { id: string; name: string }[]).map((cat: { id: string; name: string }) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={categoryIds.includes(cat.id)}
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  categoryIds.includes(cat.id)
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          {t('form.cancel')}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={() => onSubmit(values, true)}
        >
          {t('actions.saveDraft')}
        </Button>
        {canPublish ? (
          <Button type="submit" disabled={submitting}>
            {t('actions.publish')}
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {t('actions.submitForReview')}
          </Button>
        )}
      </div>
    </form>
  )
}
