import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  fetchAdminArticleDetail,
  publishArticle,
  saveArticle,
  updateArticle,
} from '@/api/article.ts'
import { AdminArticleForm } from '@/components/AdminArticleForm.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { AdminArticleFormSkeleton } from '@/components/Skeleton/AdminArticleFormSkeleton.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { getErrorMessage } from '@/lib/error.ts'
import { isPositiveIntString } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'
import type { PublishArticleInput, SaveArticleInput } from '@/types/index.ts'

export default function AdminArticleEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const valid = isPositiveIntString(id)
  const articleId = Number(id)
  const { data, loading, error, retry } = useAsyncResource(
    () => fetchAdminArticleDetail(articleId),
    valid ? `admin-article:${id}` : 'admin-article:invalid',
    valid,
  )
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (!valid) {
    return <Navigate to={paths.adminArticles} replace />
  }

  const goBack = () => {
    if (location.key === 'default') {
      void navigate(paths.adminArticles)
      return
    }
    void navigate(-1)
  }

  const handleSaveDraft = async (input: SaveArticleInput) => {
    setSavingDraft(true)
    setSubmitError('')
    try {
      await saveArticle({ ...input, id: articleId })
      retry()
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async (input: PublishArticleInput) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await publishArticle({ ...input, id: articleId })
      goBack()
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (input: PublishArticleInput) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await updateArticle(articleId, input)
      goBack()
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <QueryStatus
      loading={loading}
      error={error}
      retry={retry}
      fallback={<AdminArticleFormSkeleton />}
    >
      {data ? (
        <AdminArticleForm
          key={data.id}
          initial={data}
          submitting={submitting}
          savingDraft={savingDraft}
          error={submitError}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          onUpdate={handleUpdate}
        />
      ) : (
        <p className="bg-white p-8 text-center text-[#666]">文章不存在</p>
      )}
    </QueryStatus>
  )
}
