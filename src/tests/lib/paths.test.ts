import { describe, expect, it } from 'vitest'
import { paths } from '@/lib/paths.ts'

describe('paths', () => {
  it('静态路径', () => {
    expect(paths.home).toBe('/')
    expect(paths.adminLogin).toBe('/admin/login')
    expect(paths.adminArticles).toBe('/admin/articles')
    expect(paths.adminNav).toBe('/admin/nav')
    expect(paths.adminTags).toBe('/admin/tags')
  })

  it('文章与后台编辑', () => {
    expect(paths.article(12)).toBe('/article/12')
    expect(paths.adminArticleEdit(8)).toBe('/admin/articles/8/edit')
  })

  it('分页：首页不带页码，非默认 pageSize 才进 query', () => {
    expect(paths.page(1)).toBe('/')
    expect(paths.page(2)).toBe('/page/2')
    expect(paths.page(1, 50)).toBe('/?pageSize=50')
    expect(paths.page(3, 50)).toBe('/page/3?pageSize=50')
  })

  it('搜索与分类', () => {
    expect(paths.search('react')).toBe('/search?s=react')
    expect(paths.search('react', 2)).toBe('/search?s=react&pageNum=2')
    expect(paths.category(101)).toBe('/category/101')
    expect(paths.category(101, 3)).toBe('/category/101?pageNum=3')
    expect(paths.tag('React')).toBe('/tag?tag=React')
    expect(paths.tag('React', 2)).toBe('/tag?tag=React&pageNum=2')
  })
})
