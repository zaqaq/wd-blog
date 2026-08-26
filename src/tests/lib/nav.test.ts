import { describe, expect, it } from 'vitest'
import { findNavTitle, navLeaves } from '@/lib/nav.ts'
import type { HeaderNav } from '@/types/index.ts'

const navList: HeaderNav[] = [
  { nav_id: 101, title: '前端', sub_title: [{ nav_id: 201, title: 'React' }] },
  { nav_id: 102, title: '随笔', sub_title: [] },
]

describe('navLeaves', () => {
  it('有子导航时只返回叶子，无子导航时返回自身', () => {
    expect(navLeaves(navList).map((item) => item.nav_id)).toEqual([201, 102])
  })
})

describe('findNavTitle', () => {
  it('命中叶子标题', () => {
    expect(findNavTitle(navList, 201)).toBe('React')
    expect(findNavTitle(navList, 102)).toBe('随笔')
  })

  it('未命中时返回 id 字符串', () => {
    expect(findNavTitle(navList, 999)).toBe('999')
  })
})
