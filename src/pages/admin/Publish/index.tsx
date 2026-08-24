import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publishArticle } from '@/api/article.ts'
import { AdminArticleForm } from '@/components/AdminArticleForm.tsx'
import { getErrorMessage } from '@/lib/error.ts'
import { paths } from '@/lib/paths.ts'
import type { PublishArticleInput } from '@/types/index.ts'

export default function AdminPublishPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (input: PublishArticleInput) => {
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
      mode="create"
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    />
  )
}
