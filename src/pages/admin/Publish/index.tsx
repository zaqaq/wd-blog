import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publishArticle, saveArticle } from '@/api/article.ts'
import { AdminArticleForm } from '@/components/AdminArticleForm.tsx'
import { getErrorMessage } from '@/lib/error.ts'
import { paths } from '@/lib/paths.ts'
import type { PublishArticleInput, SaveArticleInput } from '@/types/index.ts'

export default function AdminPublishPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError] = useState('')

  const handleSaveDraft = async (input: SaveArticleInput) => {
    setSavingDraft(true)
    setError('')
    try {
      const result = await saveArticle(input)
      void navigate(paths.adminArticleEdit(result.id), { replace: true })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async (input: PublishArticleInput) => {
    setSubmitting(true)
    setError('')
    try {
      await publishArticle(input)
      void navigate(paths.adminArticles)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminArticleForm
      submitting={submitting}
      savingDraft={savingDraft}
      error={error}
      onPublish={handlePublish}
      onSaveDraft={handleSaveDraft}
    />
  )
}
