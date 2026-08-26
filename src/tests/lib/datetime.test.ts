import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, fromDatetimeLocalValue, toDatetimeLocalValue } from '@/lib/datetime.ts'

describe('formatDate / formatDateTime', () => {
  it('非法日期原样返回', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
    expect(formatDateTime('not-a-date')).toBe('not-a-date')
  })

  it('合法日期格式化为中文 locale 字符串', () => {
    expect(formatDate('2024-08-26T00:00:00.000Z')).toMatch(/2024/)
    expect(formatDateTime('2024-08-26T12:00:00.000Z')).toMatch(/2024/)
  })

  it('datetime-local 空值与非法值', () => {
    expect(toDatetimeLocalValue('')).toBe('')
    expect(toDatetimeLocalValue(undefined)).toBe('')
    expect(fromDatetimeLocalValue('')).toBeUndefined()
    expect(fromDatetimeLocalValue('not-a-date')).toBeUndefined()
  })

  it('ISO 转 datetime-local 再转回可解析', () => {
    const local = toDatetimeLocalValue('2026-09-01T10:00:00.000Z')
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(fromDatetimeLocalValue(local)).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    )
  })
})
