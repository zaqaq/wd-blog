import { describe, expect, it } from 'vitest'
import {
  buildTreeRows,
  nextNavId,
  validateNavForm,
} from '@/lib/adminNav.ts'
import type { AdminNavItem } from '@/types/index.ts'

const top: AdminNavItem = {
  id: 1,
  parent_id: 0,
  nav_id: 101,
  title: '前端',
}
const child: AdminNavItem = {
  id: 2,
  parent_id: 101,
  nav_id: 201,
  title: 'React',
}

describe('buildTreeRows', () => {
  it('顶级在前，子级紧跟且 depth 为 1', () => {
    const rows = buildTreeRows([child, top])
    expect(rows.map((item) => ({ id: item.id, depth: item.depth }))).toEqual([
      { id: 1, depth: 0 },
      { id: 2, depth: 1 },
    ])
  })
})

describe('nextNavId', () => {
  it('空列表从 101 起', () => {
    expect(nextNavId([])).toBe(101)
  })

  it('取最大 nav_id + 1', () => {
    expect(nextNavId([top, child])).toBe(202)
  })
})

describe('validateNavForm', () => {
  it('标题为空或过长', () => {
    expect(validateNavForm({ title: '  ', parent_id: '0' }, [top])).toBe(
      '标题长度为 1～255 字',
    )
    expect(
      validateNavForm({ title: 'a'.repeat(256), parent_id: '0' }, [top]),
    ).toBe('标题长度为 1～255 字')
  })

  it('父级须为已有顶级导航', () => {
    expect(validateNavForm({ title: 'React', parent_id: '999' }, [top])).toBe(
      '父级须为已有顶级导航',
    )
  })

  it('编辑时不能把自己当父级', () => {
    expect(
      validateNavForm({ title: '前端', parent_id: '101' }, [top], top.id),
    ).toBe('父级须为已有顶级导航')
  })

  it('合法表单返回 null', () => {
    expect(validateNavForm({ title: 'React', parent_id: '101' }, [top])).toBe(
      null,
    )
    expect(validateNavForm({ title: '前端', parent_id: '0' }, [])).toBe(null)
  })
})
