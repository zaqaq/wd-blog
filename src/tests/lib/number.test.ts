import { describe, expect, it } from 'vitest'
import { isPositiveIntString, parsePositiveInt } from '@/lib/number.ts'

describe('parsePositiveInt', () => {
  it('空值使用默认 1', () => {
    expect(parsePositiveInt(undefined)).toBe(1)
    expect(parsePositiveInt('')).toBe(1)
  })

  it('解析正整数', () => {
    expect(parsePositiveInt('3')).toBe(3)
  })

  it('非法值回退', () => {
    expect(parsePositiveInt('0', 2)).toBe(2)
    expect(parsePositiveInt('-1', 2)).toBe(2)
    expect(parsePositiveInt('1.5', 2)).toBe(2)
    expect(parsePositiveInt('abc', 2)).toBe(2)
  })
})

describe('isPositiveIntString', () => {
  it('只接受正整数字符串', () => {
    expect(isPositiveIntString('12')).toBe(true)
    expect(isPositiveIntString('0')).toBe(false)
    expect(isPositiveIntString('01')).toBe(true)
    expect(isPositiveIntString('1.2')).toBe(false)
    expect(isPositiveIntString(undefined)).toBe(false)
  })
})
