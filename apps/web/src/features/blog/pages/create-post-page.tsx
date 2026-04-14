import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostForm } from '../components/post-form'
import { usePostMutations } from '../hooks/use-post-mutations'

export function CreatePostPage() {
  const { t } = useTranslation('blog')
  const navigate = useNavigate()
  const { createPost, creating } = usePostMutations()

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
    const result = await createPost({
      variables: {
        input: {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          categoryIds: values.categoryIds,
          publish: !asDraft,
          images: values.images.length > 0 ? values.images : undefined,
        },
      },
    })

    const resultData = result.data as { createPost?: { id: string; status: string } | null } | null | undefined
    const id = resultData?.createPost?.id
    if (id) navigate(`/blog/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t('pages.create')}</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="gap-1.5">
          {t('actions.back')}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/blog')}
        submitting={creating}
      />
    </div>
  )
}

export default CreatePostPage
