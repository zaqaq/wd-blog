import type { ReactNode } from 'react'
import { ErrorState } from '@/components/ErrorState.tsx'

type QueryStatusProps = {
  loading: boolean
  error: string | null
  retry?: () => void
  fallback: ReactNode
  children: ReactNode
}

export function QueryStatus({
  loading,
  error,
  retry,
  fallback,
  children,
}: QueryStatusProps) {
  if (loading) {
    return fallback
  }
  if (error) {
    return <ErrorState message={error} onRetry={retry} />
  }
  return children
}
