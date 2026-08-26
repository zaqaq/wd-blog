import { describe, expect, it } from 'vitest'
import { isSelectedValue, toggleSelectedValues, visibleTagSlice } from '@/lib/select.ts'

describe('toggleSelectedValues', () => {
  it('选中与取消', () => {
    expect(toggleSelectedValues(['React'], 'Fastify')).toEqual([
      'React',
      'Fastify',
    ])
    expect(toggleSelectedValues(['React'], 'React')).toEqual([])
  })

  it('达到上限不再追加', () => {
    expect(toggleSelectedValues(['1', '2'], '3', 2)).toEqual(['1', '2'])
  })
})

describe('isSelectedValue', () => {
  it('单选与多选', () => {
    expect(isSelectedValue('React', 'React')).toBe(true)
    expect(isSelectedValue(['React', 'Vue'], 'Vue')).toBe(true)
    expect(isSelectedValue(['React'], 'Vue')).toBe(false)
  })
})

describe('visibleTagSlice', () => {
  it('未设上限或未超出时全部展示', () => {
    expect(visibleTagSlice(['a', 'b'])).toEqual({
      visible: ['a', 'b'],
      overflow: 0,
      rest: [],
    })
    expect(visibleTagSlice(['a', 'b'], 2)).toEqual({
      visible: ['a', 'b'],
      overflow: 0,
      rest: [],
    })
  })

  it('超出后截断并给出 +N', () => {
    expect(visibleTagSlice(['a', 'b', 'c', 'd'], 2)).toEqual({
      visible: ['a', 'b'],
      overflow: 2,
      rest: ['c', 'd'],
    })
  })

  it('上限为 0 时全部计入溢出', () => {
    expect(visibleTagSlice(['a', 'b'], 0)).toEqual({
      visible: [],
      overflow: 2,
      rest: ['a', 'b'],
    })
  })
})
