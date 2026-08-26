import { describe, expect, it } from 'vitest'
import {
  articleStatusLabel,
  canDeleteArticle,
  formatTagInput,
  initialArticleTags,
  isPubliclyVisible,
  parseArticleStatus,
  parseTagInput,
  patchArticleListStatus,
  toPublishInput,
  toSaveInput,
  toggleTag,
  validateDraftFields,
  validatePublishFields,
} from '@/lib/articleForm.ts'

describe('parseTagInput', () => {
  it('按中英文逗号拆分、去重、去空白', () => {
    expect(parseTagInput(' React，React, Fastify , ')).toEqual([
      'React',
      'Fastify',
    ])
  })
})

describe('formatTagInput / initialArticleTags', () => {
  it('优先用 tags，否则回退 tag', () => {
    expect(formatTagInput(['React', 'Fastify'])).toBe('React，Fastify')
    expect(formatTagInput([], 'Vue')).toBe('Vue')
    expect(formatTagInput(undefined, null)).toBe('')
    expect(initialArticleTags(['React'])).toEqual(['React'])
    expect(initialArticleTags([], 'Vue')).toEqual(['Vue'])
    expect(initialArticleTags(undefined, null)).toEqual([])
  })
})

describe('toggleTag', () => {
  it('选中、取消，满 5 个不再追加', () => {
    expect(toggleTag(['React'], 'Fastify')).toEqual(['React', 'Fastify'])
    expect(toggleTag(['React'], 'React')).toEqual([])
    expect(toggleTag(['1', '2', '3', '4', '5'], '6')).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ])
  })
})

describe('articleStatusLabel / isPubliclyVisible', () => {
  it('草稿与下架', () => {
    expect(articleStatusLabel('draft')).toBe('草稿')
    expect(articleStatusLabel('unpublished')).toBe('已下架')
    expect(isPubliclyVisible('draft')).toBe(false)
    expect(isPubliclyVisible('unpublished')).toBe(false)
  })

  it('已发布且未定时则前台可见', () => {
    expect(articleStatusLabel('published')).toBe('已发布')
    expect(isPubliclyVisible('published')).toBe(true)
  })

  it('定时未到点时显示定时且前台不可见', () => {
    const later = new Date(Date.now() + 86400000).toISOString()
    expect(articleStatusLabel('published', later)).toBe('定时')
    expect(isPubliclyVisible('published', later)).toBe(false)
  })
})

describe('canDeleteArticle', () => {
  it('上架中不可删除', () => {
    expect(canDeleteArticle('published')).toBe(false)
    expect(canDeleteArticle('unpublished')).toBe(true)
    expect(canDeleteArticle('draft')).toBe(true)
  })
})

describe('patchArticleListStatus', () => {
  it('只改匹配行的状态', () => {
    const rows = [
      { id: 1, status: 'draft' as const },
      { id: 2, status: 'unpublished' as const },
    ]
    expect(patchArticleListStatus(rows, 2, 'published')).toEqual([
      { id: 1, status: 'draft' },
      { id: 2, status: 'published' },
    ])
  })
})

describe('parseArticleStatus', () => {
  it('只接受三种状态', () => {
    expect(parseArticleStatus('draft')).toBe('draft')
    expect(parseArticleStatus('all')).toBeUndefined()
    expect(parseArticleStatus(null)).toBeUndefined()
  })
})

describe('validateDraftFields / validatePublishFields', () => {
  const filled = {
    title: '标题',
    des: '摘要',
    content: '正文',
    tags: ['React'],
    navId: '204',
    imgHref: '',
  }
  const known = ['React', 'Fastify']

  it('草稿只要求标题', () => {
    expect(
      validateDraftFields({
        title: '',
        tags: [],
        des: '',
        imgHref: '',
      }),
    ).toEqual({ title: '请填写标题' })
    expect(
      validateDraftFields({
        title: '草稿',
        tags: [],
        des: '',
        imgHref: '',
      }),
    ).toEqual({})
  })

  it('发布要求摘要、正文、标签和分类', () => {
    expect(
      validatePublishFields({
        title: '标题',
        des: '',
        content: '',
        tags: [],
        navId: '',
        imgHref: '',
      }),
    ).toMatchObject({
      des: '请填写摘要',
      content: '请填写正文',
      tags: '请选择至少一个标签',
      nav_id: '请选择分类',
    })
    expect(validatePublishFields(filled, known)).toEqual({})
  })

  it('标签最多 5 个，且必须已存在', () => {
    expect(
      validateDraftFields({
        title: 't',
        tags: ['1', '2', '3', '4', '5', '6'],
        des: '',
        imgHref: '',
      }).tags,
    ).toBe('最多 5 个标签')
    expect(
      validateDraftFields(
        {
          title: 't',
          tags: ['未知'],
          des: '',
          imgHref: '',
        },
        known,
      ).tags,
    ).toBe('只能选择已有标签')
  })
})

describe('toSaveInput / toPublishInput', () => {
  it('草稿可省略空字段', () => {
    expect(
      toSaveInput(
        {
          title: '还没写完',
          des: '',
          content: '',
          tags: [],
          navId: '',
          imgHref: '',
        },
        13,
      ),
    ).toEqual({ id: 13, title: '还没写完' })
  })

  it('发布带上 tags 与可选封面', () => {
    expect(
      toPublishInput({
        title: '标题',
        des: '摘要',
        content: '正文',
        tags: ['React', 'Fastify'],
        navId: '204',
        imgHref: '/uploads/a.png',
      }),
    ).toEqual({
      title: '标题',
      des: '摘要',
      content: '正文',
      tags: ['React', 'Fastify'],
      nav_id: 204,
      img_href: '/uploads/a.png',
    })
  })
})
