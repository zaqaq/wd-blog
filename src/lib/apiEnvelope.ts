export type ApiSuccess<T> = {
  code: number
  message: string
  data: T
}

export function isApiEnvelope(
  body: unknown,
): body is ApiSuccess<unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return false
  }
  const record = body as Record<string, unknown>
  return (
    typeof record.code === 'number' &&
    typeof record.message === 'string' &&
    'data' in record
  )
}

export function unwrapApiBody<T>(body: unknown): T {
  if (isApiEnvelope(body)) {
    return body.data as T
  }
  return body as T
}
