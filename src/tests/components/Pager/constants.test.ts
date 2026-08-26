import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PAGE_SIZE,
  parsePageSize,
} from '@/components/Pager/constants.ts'

describe('parsePageSize', () => {
  it('合法选项原样返回', () => {
    expect(parsePageSize('10')).toBe(10)
    expect(parsePageSize('20')).toBe(20)
    expect(parsePageSize('100')).toBe(100)
  })

  it('非法值回退默认页大小', () => {
    expect(parsePageSize(undefined)).toBe(DEFAULT_PAGE_SIZE)
    expect(parsePageSize(null)).toBe(DEFAULT_PAGE_SIZE)
    expect(parsePageSize('15')).toBe(DEFAULT_PAGE_SIZE)
    expect(parsePageSize('abc')).toBe(DEFAULT_PAGE_SIZE)
  })
})
