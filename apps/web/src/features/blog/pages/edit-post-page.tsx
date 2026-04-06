import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostForm } from '../components/post-form'
import { usePostMutations } from '../hooks/use-post-mutations'
import { usePostDetail } from '../hooks/use-post-detail'

export function EditPostPage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { post, loading, error } = usePostDetail(id ?? '')
  const { updatePost, updating } = usePostMutations()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Cargando" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('error.title')}</p>
        <Button variant="outline" size="sm" onClick={() => navigate(`/blog/${id}`)}>
          {t('actions.back')}
        </Button>
      </div>
    )
  }

  async function handleSubmit(
    values: {
      title: string
      excerpt: string
      content: string
      categoryIds: string[]
      images: { url: string; publicId: string; order: number }[]
    },
    asDraft: boolean,
  ) {
    await updatePost({
      variables: {
        id: id ?? '',
        input: {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          categoryIds: values.categoryIds,
          images: values.images.length > 0 ? values.images : undefined,
          ...(asDraft ? { status: 'draft' } : {}),
        },
      },
    })
    navigate(`/blog/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pages.edit')}</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/blog/${id}`)} className="gap-1.5">
          {t('actions.back')}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <PostForm
        initialValues={{
          title: post.title,
          excerpt: post.excerpt ?? '',
          content: (post.content ?? '').replace(/<[^>]+>/g, '\n').replace(/\n{2,}/g, '\n\n').trim(),
          categoryIds: (post.categories as { id: string }[]).map((c: { id: string }) => c.id),
          images: (post.images ?? []).map((img: { url: string; publicId: string; order: number }) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/blog/${id}`)}
        submitting={updating}
      />
    </div>
  )
}

export default EditPostPage
