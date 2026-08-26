import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchAdminTagList } from '@/api/tag.ts'
import { ImageUploadButton } from '@/components/ImageUploadButton.tsx'
import { MarkdownEditor } from '@/components/MarkdownEditor.tsx'
import { Select } from '@/components/Select/index.tsx'
import { useHeaderNav } from '@/hooks/useBlogData.ts'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import {
  MAX_TAGS,
  articleStatusLabel,
  initialArticleTags,
  toPublishInput,
  toSaveInput,
  validateDraftFields,
  validatePublishFields,
} from '@/lib/articleForm.ts'
import { toDatetimeLocalValue } from '@/lib/datetime.ts'
import { navLeaves } from '@/lib/nav.ts'
import { paths } from '@/lib/paths.ts'
import type {
  ArticleStatus,
  NavItem,
  PublishArticleInput,
  SaveArticleInput,
} from '@/types/index.ts'

type AdminArticleFormProps = {
  initial?: {
    id?: number
    title?: string
    des?: string | null
    content?: string
    tag?: string | null
    tags?: string[]
    nav_id?: number | null
    img_href?: string | null
    status?: ArticleStatus
    scheduled_at?: string | null
  }
  submitting: boolean
  savingDraft: boolean
  error: string
  onPublish: (input: PublishArticleInput) => void | Promise<void>
  onSaveDraft: (input: SaveArticleInput) => void | Promise<void>
  onUpdate?: (input: PublishArticleInput) => void | Promise<void>
}

const fieldClass =
  'h-10 w-full rounded-md border border-[#dbe1ea] bg-white px-3 text-sm outline-none transition focus:border-[#09f]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#344054]'
const panelClass = 'rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]'

export function AdminArticleForm({
  initial,
  submitting,
  savingDraft,
  error,
  onPublish,
  onSaveDraft,
  onUpdate,
}: AdminArticleFormProps) {
  const { data: navList, loading: navLoading, error: navError, retry } =
    useHeaderNav()
  const {
    data: tagData,
    loading: tagLoading,
    error: tagError,
    retry: retryTags,
  } = useAsyncResource(() => fetchAdminTagList(), 'admin-tag-list')
  const knownTagNames = (tagData?.tagList ?? []).map((item) => item.name)
  const navigate = useNavigate()
  const location = useLocation()
  const goBackToList = () => {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(paths.adminArticles)
  }
  const categories = useMemo(() => navLeaves(navList ?? []), [navList])
  const articleId = initial?.id
  const status = initial?.status
  const isPublished = status === 'published'
  const isUnpublished = status === 'unpublished'
  const showDraftButton = !status || status === 'draft'
  const busy = submitting || savingDraft
  const [title, setTitle] = useState(initial?.title ?? '')
  const [des, setDes] = useState(initial?.des ?? '')
  const [tags, setTags] = useState(
    initialArticleTags(initial?.tags, initial?.tag),
  )
  const [navId, setNavId] = useState(
    initial?.nav_id != null ? String(initial.nav_id) : '',
  )
  const [imgHref, setImgHref] = useState(initial?.img_href ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [scheduledLocal, setScheduledLocal] = useState(
    toDatetimeLocalValue(initial?.scheduled_at),
  )
  const [fieldError, setFieldError] = useState<Record<string, string>>({})

  const fields = {
    title,
    des,
    content,
    tags,
    navId,
    imgHref,
  }

  const clearTagError = () => {
    setFieldError((current) => {
      if (!current.tags) {
        return current
      }
      const { tags: _tags, ...rest } = current
      return rest
    })
  }

  const handleTagsChange = (next: string[]) => {
    setTags(next)
    clearTagError()
  }

  const handleSaveDraft = () => {
    const nextErrors = validateDraftFields(
      fields,
      tagLoading ? undefined : knownTagNames,
    )
    setFieldError(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    void onSaveDraft(toSaveInput(fields, articleId))
  }

  const submitPublishable = () => {
    const nextErrors = validatePublishFields(
      fields,
      tagLoading ? undefined : knownTagNames,
    )
    setFieldError(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return null
    }
    return toPublishInput(fields, articleId, scheduledLocal)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = submitPublishable()
    if (!input) {
      return
    }
    if (isPublished && onUpdate) {
      void onUpdate(input)
      return
    }
    void onPublish(input)
  }

  const heading =
    status != null ? articleStatusLabel(status, initial?.scheduled_at) : '新文章'

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <section className={`${panelClass} px-5 py-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#1f2937]">
              {articleId ? '编辑文章' : '写文章'}
            </h1>
            <p className="mt-1 text-sm text-[#98a2b3]">
              当前状态：{heading}
              {articleId ? ` · #${articleId}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={goBackToList}
            className="cursor-pointer text-sm text-[#667085] hover:text-[#09f]"
          >
            返回列表
          </button>
        </div>
      </section>

      {navError && (
        <p className="rounded-md bg-[#e5484d]/8 px-4 py-3 text-sm text-[#e5484d]">
          分类加载失败：{navError}{' '}
          <button type="button" className="text-[#09f]" onClick={retry}>
            重试
          </button>
        </p>
      )}

      {tagError && (
        <p className="rounded-md bg-[#e5484d]/8 px-4 py-3 text-sm text-[#e5484d]">
          标签加载失败：{tagError}{' '}
          <button type="button" className="text-[#09f]" onClick={retryTags}>
            重试
          </button>
        </p>
      )}

      <section className={`${panelClass} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-[#344054]">
          基本信息
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>
              标题
            </label>
            <input
              id="title"
              value={title}
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
              className={fieldClass}
            />
            {fieldError.title && (
              <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="des" className={labelClass}>
              摘要
            </label>
            <textarea
              id="des"
              value={des}
              maxLength={255}
              rows={3}
              onChange={(event) => setDes(event.target.value)}
              className="w-full rounded-md border border-[#dbe1ea] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#09f]"
            />
            {fieldError.des && (
              <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.des}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tags" className={labelClass}>
                标签
                <span className="ml-1 font-normal text-[#98a2b3]">
                  （最多 {MAX_TAGS} 个）
                </span>
              </label>
              {tagLoading ? (
                <p className="text-sm text-[#98a2b3]">标签加载中…</p>
              ) : (tagData?.tagList.length ?? 0) === 0 ? (
                <p className="text-sm text-[#667085]">
                  暂无标签，请先到
                  <Link
                    to={paths.adminTags}
                    className="mx-1 text-[#09f] hover:underline"
                  >
                    标签管理
                  </Link>
                  创建
                </p>
              ) : (
                <Select
                  mode="tags"
                  id="tags"
                  value={tags}
                  max={MAX_TAGS}
                  maxTagCount={3}
                  disabled={busy}
                  placeholder="请选择标签"
                  onChange={handleTagsChange}
                  options={(tagData?.tagList ?? []).map((item) => ({
                    value: item.name,
                    label: item.name,
                  }))}
                />
              )}
              {fieldError.tags && (
                <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.tags}</p>
              )}
            </div>
            <div>
              <label htmlFor="nav_id" className={labelClass}>
                分类
              </label>
              <Select
                id="nav_id"
                value={navId}
                disabled={navLoading || categories.length === 0}
                placeholder={navLoading ? '分类加载中…' : '请选择分类'}
                onChange={setNavId}
                options={categories.map((item: NavItem) => ({
                  value: String(item.nav_id),
                  label: item.title,
                }))}
              />
              {fieldError.nav_id && (
                <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.nav_id}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="img_href" className={labelClass}>
              封面
              <span className="ml-1 font-normal text-[#98a2b3]">（可选）</span>
            </label>
            <div className="flex flex-wrap items-start gap-3">
              <input
                id="img_href"
                value={imgHref}
                maxLength={500}
                onChange={(event) => setImgHref(event.target.value)}
                placeholder="上传或粘贴图片地址"
                className={`${fieldClass} min-w-0 flex-1`}
              />
              <ImageUploadButton
                label="上传封面"
                disabled={busy}
                onUploaded={setImgHref}
              />
            </div>
            {fieldError.img_href && (
              <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.img_href}</p>
            )}
            {imgHref.trim() ? (
              <img
                src={imgHref.trim()}
                alt=""
                className="mt-3 h-28 w-44 rounded-md object-cover bg-[#eef1f6]"
              />
            ) : null}
          </div>

          {!isPublished ? (
            <div>
              <label htmlFor="scheduled_at" className={labelClass}>
                定时发布
                <span className="ml-1 font-normal text-[#98a2b3]">
                  （可选，留空则立即发布）
                </span>
              </label>
              <input
                id="scheduled_at"
                type="datetime-local"
                value={scheduledLocal}
                onChange={(event) => setScheduledLocal(event.target.value)}
                className={`${fieldClass} max-w-xs`}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className={`${panelClass} p-5`}>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-[#344054]">
          正文内容
        </h2>
        <MarkdownEditor value={content} onChange={setContent} />
        {fieldError.content && (
          <p className="mt-2 text-sm text-[#e5484d]">{fieldError.content}</p>
        )}
      </section>

      {error && (
        <div className="rounded-md bg-[#e5484d]/8 px-4 py-3 text-sm text-[#e5484d]">
          {error}
        </div>
      )}

      <section className="sticky bottom-0 z-10 rounded-lg bg-white px-5 py-3 shadow-[0_-1px_4px_rgba(16,24,40,0.05)]">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={goBackToList}
            className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[#dbe1ea] bg-white px-4 text-sm text-[#667085] hover:bg-[#f8fafc]"
          >
            取消
          </button>
          {showDraftButton ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleSaveDraft}
              className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[#dbe1ea] bg-white px-4 text-sm text-[#344054] hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {savingDraft ? '保存中…' : '保存草稿'}
            </button>
          ) : null}
          {isUnpublished && onUpdate ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const input = submitPublishable()
                if (input) {
                  void onUpdate(input)
                }
              }}
              className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[#dbe1ea] bg-white px-4 text-sm text-[#344054] hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {submitting ? '保存中…' : '保存'}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="h-10 cursor-pointer rounded-md bg-[#09f] px-6 text-sm font-medium text-white hover:bg-[#0088e0] disabled:opacity-60"
          >
            {submitting
              ? isPublished
                ? '保存中…'
                : '发布中…'
              : isPublished
                ? '保存'
                : '发布'}
          </button>
        </div>
      </section>
    </form>
  )
}
