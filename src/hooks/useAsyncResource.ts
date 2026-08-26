import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '@/lib/error.ts'

export function useAsyncResource<T>(
  factory: () => Promise<T>,
  key: string,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)
  const factoryRef = useRef(factory)
  factoryRef.current = factory

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setError(null)
      setData(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void factoryRef
      .current()
      .then((res) => {
        if (!cancelled) {
          setData(res)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null)
          setError(getErrorMessage(err))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [key, version, enabled])

  const retry = useCallback(() => {
    setVersion((value) => value + 1)
  }, [])

  const mutate = useCallback((updater: (current: T) => T) => {
    setData((current) => (current == null ? current : updater(current)))
  }, [])

  return { data, loading, error, retry, mutate }
}
