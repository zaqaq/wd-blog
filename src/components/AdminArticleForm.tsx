import { useMemo, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MarkdownEditor } from '@/components/MarkdownEditor.tsx'
import { useHeaderNav } from '@/hooks/useBlogData.ts'
import { navLeaves } from '@/lib/nav.ts'
import { paths } from '@/lib/paths.ts'
import type { NavItem, PublishArticleInput } from '@/types/index.ts'

type AdminArticleFormProps = {
  mode: 'create' | 'edit'
  initial?: Partial<PublishArticleInput>
  submitting: boolean
  error: string
  onSubmit: (input: PublishArticleInput) => void | Promise<void>
}

const fieldClass =
  'h-10 w-full rounded-md border border-[#dbe1ea] bg-white px-3 text-sm outline-none transition focus:border-[#09f]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#344054]'
const panelClass = 'rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]'

export function AdminArticleForm({
  mode,
  initial,
  submitting,
  error,
  onSubmit,
}: AdminArticleFormProps) {
  const { data: navList, loading: navLoading, error: navError, retry } =
    useHeaderNav()
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
  const [title, setTitle] = useState(initial?.title ?? '')
  const [des, setDes] = useState(initial?.des ?? '')
  const [tag, setTag] = useState(initial?.tag ?? '')
  const [navId, setNavId] = useState(
    initial?.nav_id != null ? String(initial.nav_id) : '',
  )
  const [imgHref, setImgHref] = useState(initial?.img_href ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [fieldError, setFieldError] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = title.trim()
    const nextDes = des.trim()
    const nextTag = tag.trim()
    const nextContent = content.trim()
    const nextImg = imgHref.trim()
    const parsedNavId = Number(navId)
    const nextErrors: Record<string, string> = {}

    if (!nextTitle) nextErrors.title = '请填写标题'
    else if (nextTitle.length > 120) nextErrors.title = '标题最多 120 字'

    if (!nextDes) nextErrors.des = '请填写摘要'
    else if (nextDes.length > 255) nextErrors.des = '摘要最多 255 字'

    if (!nextTag) nextErrors.tag = '请填写标签'
    else if (nextTag.length > 20) nextErrors.tag = '标签最多 20 字'

    if (!Number.isInteger(parsedNavId) || parsedNavId <= 0) {
      nextErrors.nav_id = '请选择分类'
    }

    if (!nextContent) nextErrors.content = '请填写正文'
    if (nextImg.length > 300) nextErrors.img_href = '封面地址最多 300 字'

    setFieldError(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    void onSubmit({
      title: nextTitle,
      des: nextDes,
      content: nextContent,
      tag: nextTag,
      nav_id: parsedNavId,
      ...(nextImg ? { img_href: nextImg } : {}),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <section className={`${panelClass} px-5 py-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#1f2937]">
              {mode === 'edit' ? '编辑文章' : '发布文章'}
            </h1>
            <p className="mt-1 text-sm text-[#98a2b3]">
              {mode === 'edit'
                ? '修改后保存即可同步到前台'
                : '填写基本信息与正文后发布'}
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
              <label htmlFor="tag" className={labelClass}>
                标签
              </label>
              <input
                id="tag"
                value={tag}
                maxLength={20}
                onChange={(event) => setTag(event.target.value)}
                className={fieldClass}
              />
              {fieldError.tag && (
                <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.tag}</p>
              )}
            </div>
            <div>
              <label htmlFor="nav_id" className={labelClass}>
                分类
              </label>
              <select
                id="nav_id"
                value={navId}
                disabled={navLoading || categories.length === 0}
                onChange={(event) => setNavId(event.target.value)}
                className={fieldClass}
              >
                <option value="">
                  {navLoading ? '分类加载中…' : '请选择分类'}
                </option>
                {categories.map((item: NavItem) => (
                  <option key={item.nav_id} value={item.nav_id}>
                    {item.title}
                  </option>
                ))}
              </select>
              {fieldError.nav_id && (
                <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.nav_id}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="img_href" className={labelClass}>
              封面图 URL
              <span className="ml-1 font-normal text-[#98a2b3]">（可选）</span>
            </label>
            <input
              id="img_href"
              value={imgHref}
              maxLength={300}
              onChange={(event) => setImgHref(event.target.value)}
              className={fieldClass}
            />
            {fieldError.img_href && (
              <p className="mt-1.5 text-sm text-[#e5484d]">{fieldError.img_href}</p>
            )}
          </div>
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
          <button
            type="submit"
            disabled={submitting}
            className="h-10 cursor-pointer rounded-md bg-[#09f] px-6 text-sm font-medium text-white hover:bg-[#0088e0] disabled:opacity-60"
          >
            {submitting
              ? mode === 'edit'
                ? '保存中…'
                : '发布中…'
              : mode === 'edit'
                ? '保存'
                : '发布'}
          </button>
        </div>
      </section>
    </form>
  )
}
