import {
  fromDatetimeLocalValue,
} from '@/lib/datetime.ts'
import type {
  ArticleStatus,
  PublishArticleInput,
  SaveArticleInput,
} from '@/types/index.ts'

export const MAX_TAGS = 5
export const MAX_TAG_LENGTH = 20
export const MAX_IMG_HREF = 500

export function parseTagInput(raw: string) {
  const seen = new Set<string>()
  const tags: string[] = []
  for (const part of raw.split(/[,，]/)) {
    const name = part.trim()
    if (!name || seen.has(name)) {
      continue
    }
    seen.add(name)
    tags.push(name)
  }
  return tags
}

export function formatTagInput(tags: string[] | undefined, fallback?: string | null) {
  if (tags && tags.length > 0) {
    return tags.join('，')
  }
  return fallback?.trim() ?? ''
}

export function articleStatusLabel(
  status: ArticleStatus,
  scheduledAt?: string | null,
) {
  if (
    status === 'published' &&
    scheduledAt &&
    !Number.isNaN(new Date(scheduledAt).getTime()) &&
    new Date(scheduledAt) > new Date()
  ) {
    return '定时'
  }
  if (status === 'draft') {
    return '草稿'
  }
  if (status === 'unpublished') {
    return '已下架'
  }
  return '已发布'
}

export function isPubliclyVisible(
  status: ArticleStatus,
  scheduledAt?: string | null,
) {
  if (status !== 'published') {
    return false
  }
  if (!scheduledAt) {
    return true
  }
  const at = new Date(scheduledAt)
  return !Number.isNaN(at.getTime()) && at <= new Date()
}

export function canDeleteArticle(status: ArticleStatus) {
  return status !== 'published'
}

export function patchArticleListStatus<T extends { id: number; status: ArticleStatus }>(
  articles: readonly T[],
  id: number,
  status: ArticleStatus,
) {
  return articles.map((item) =>
    item.id === id ? { ...item, status } : item,
  )
}

export type ArticleFormFields = {
  title: string
  des: string
  content: string
  tags: string[]
  navId: string
  imgHref: string
}

export function initialArticleTags(
  tags: string[] | undefined,
  fallback?: string | null,
) {
  if (tags && tags.length > 0) {
    return tags
  }
  const name = fallback?.trim()
  return name ? [name] : []
}

export function toggleTag(tags: string[], name: string) {
  if (tags.includes(name)) {
    return tags.filter((item) => item !== name)
  }
  if (tags.length >= MAX_TAGS) {
    return tags
  }
  return [...tags, name]
}

function unknownTags(tags: string[], knownNames?: string[]) {
  if (!knownNames) {
    return false
  }
  const known = new Set(knownNames)
  return tags.some((tag) => !known.has(tag))
}

export function validateDraftFields(
  fields: Pick<ArticleFormFields, 'title' | 'tags' | 'des' | 'imgHref'>,
  knownTagNames?: string[],
) {
  const errors: Record<string, string> = {}
  const title = fields.title.trim()
  const tags = fields.tags
  const des = fields.des.trim()
  const imgHref = fields.imgHref.trim()

  if (!title) {
    errors.title = '请填写标题'
  } else if (title.length > 120) {
    errors.title = '标题最多 120 字'
  }

  if (des.length > 255) {
    errors.des = '摘要最多 255 字'
  }

  if (tags.length > MAX_TAGS) {
    errors.tags = `最多 ${MAX_TAGS} 个标签`
  } else if (unknownTags(tags, knownTagNames)) {
    errors.tags = '只能选择已有标签'
  }

  if (imgHref.length > MAX_IMG_HREF) {
    errors.img_href = `封面地址最多 ${MAX_IMG_HREF} 字`
  }

  return errors
}

export function validatePublishFields(
  fields: ArticleFormFields,
  knownTagNames?: string[],
) {
  const errors = validateDraftFields(fields, knownTagNames)
  const des = fields.des.trim()
  const content = fields.content.trim()
  const navId = Number(fields.navId)

  if (!des) {
    errors.des = '请填写摘要'
  }

  if (!content) {
    errors.content = '请填写正文'
  }

  if (fields.tags.length === 0) {
    errors.tags = '请选择至少一个标签'
  }

  if (!Number.isInteger(navId) || navId <= 0) {
    errors.nav_id = '请选择分类'
  }

  return errors
}

export function toSaveInput(
  fields: ArticleFormFields,
  articleId?: number,
): SaveArticleInput {
  const navId = Number(fields.navId)
  const imgHref = fields.imgHref.trim()
  const des = fields.des.trim()
  return {
    ...(articleId ? { id: articleId } : {}),
    title: fields.title.trim(),
    ...(des ? { des } : {}),
    ...(fields.content ? { content: fields.content } : {}),
    ...(fields.tags.length > 0 ? { tags: fields.tags } : {}),
    ...(Number.isInteger(navId) && navId > 0 ? { nav_id: navId } : {}),
    ...(imgHref ? { img_href: imgHref } : {}),
  }
}

export function toPublishInput(
  fields: ArticleFormFields,
  articleId?: number,
  scheduledLocal?: string,
): PublishArticleInput {
  const imgHref = fields.imgHref.trim()
  const scheduledAt = fromDatetimeLocalValue(scheduledLocal ?? '')
  return {
    ...(articleId ? { id: articleId } : {}),
    title: fields.title.trim(),
    des: fields.des.trim(),
    content: fields.content.trim(),
    tags: fields.tags,
    nav_id: Number(fields.navId),
    ...(imgHref ? { img_href: imgHref } : {}),
    ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
  }
}

const ARTICLE_STATUSES: ArticleStatus[] = [
  'draft',
  'published',
  'unpublished',
]

export function parseArticleStatus(value: string | null | undefined) {
  if (value && ARTICLE_STATUSES.includes(value as ArticleStatus)) {
    return value as ArticleStatus
  }
  return undefined
}
