import type { ReactNode } from 'react'
import { ErrorState } from '@/components/ErrorState.tsx'
import { GlobalLoading } from '@/components/Loading/GlobalLoading.tsx'

type QueryStatusProps = {
  loading: boolean
  error: string | null
  retry?: () => void
  children: ReactNode
}

export function QueryStatus({
  loading,
  error,
  retry,
  children,
}: QueryStatusProps) {
  if (loading) {
    return <GlobalLoading />
  }
  if (error) {
    return <ErrorState message={error} onRetry={retry} />
  }
  return children
}
