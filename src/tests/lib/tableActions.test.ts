import { describe, expect, it } from 'vitest'
import { splitTableActions } from '@/lib/tableActions.ts'

describe('splitTableActions', () => {
  it('不超过上限时全部内联', () => {
    expect(splitTableActions(['a', 'b', 'c'])).toEqual({
      inline: ['a', 'b', 'c'],
      rest: [],
    })
  })

  it('超出后保留 maxInline-1 个，其余进更多', () => {
    expect(splitTableActions(['查看', '编辑', '下架', '删除'])).toEqual({
      inline: ['查看', '编辑'],
      rest: ['下架', '删除'],
    })
  })
})
