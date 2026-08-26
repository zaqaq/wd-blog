import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from '@/lib/datetime.ts'

describe('formatDate / formatDateTime', () => {
  it('非法日期原样返回', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
    expect(formatDateTime('not-a-date')).toBe('not-a-date')
  })

  it('合法日期格式化为中文 locale 字符串', () => {
    expect(formatDate('2024-08-26T00:00:00.000Z')).toMatch(/2024/)
    expect(formatDateTime('2024-08-26T12:00:00.000Z')).toMatch(/2024/)
  })
})
