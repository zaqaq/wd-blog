import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { deleteArticle, fetchAdminArticleList } from '@/api/article.ts'
import { DEFAULT_PAGE_SIZE, Pager, parsePageSize } from '@/components/Pager/index.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { useHeaderNav } from '@/hooks/useBlogData.ts'
import { useRestoreListScroll } from '@/hooks/useRestoreListScroll.ts'
import { formatDateTime } from '@/lib/datetime.ts'
import { getErrorMessage } from '@/lib/error.ts'
import { findNavTitle } from '@/lib/nav.ts'
import { parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'
import { saveScrollPosition } from '@/lib/scroll.ts'

export default function AdminArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = parsePositiveInt(searchParams.get('pageNum') ?? undefined)
  const pageSize = parsePageSize(searchParams.get('pageSize'))
  const keyword = (searchParams.get('key') ?? '').trim()
  const [draft, setDraft] = useState(keyword)
  const [actionError, setActionError] = useState('')
  const tableScrollRef = useRef<HTMLTableSectionElement>(null)
  const location = useLocation()
  const { data: navList } = useHeaderNav()
  const { data, loading, error, retry } = useAsyncResource(
    () => fetchAdminArticleList(pageNum, pageSize, keyword || undefined),
    `admin-articles:${pageNum}:${pageSize}:${keyword}`,
  )

  const updateQuery = (next: { pageNum?: number; pageSize?: number; key?: string }) => {
    const params = new URLSearchParams()
    const nextPage = next.pageNum ?? pageNum
    const nextSize = next.pageSize ?? pageSize
    const nextKey = next.key ?? keyword
    if (nextPage > 1) {
      params.set('pageNum', String(nextPage))
    }
    if (nextSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', String(nextSize))
    }
    if (nextKey) {
      params.set('key', nextKey)
    }
    setSearchParams(params)
    tableScrollRef.current?.scrollTo({ top: 0 })
  }

  const handleSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateQuery({ pageNum: 1, key: draft.trim() })
  }

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setDraft(value)
    if (value === '') {
      updateQuery({ pageNum: 1, key: '' })
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`确定删除「${title}」？删除后无法恢复。`)) {
      return
    }
    setActionError('')
    try {
      await deleteArticle(id)
      if (articles.length === 1 && pageNum > 1) {
        updateQuery({ pageNum: pageNum - 1 })
      } else {
        retry()
      }
    } catch (err: unknown) {
      setActionError(getErrorMessage(err))
    }
  }

  const articles = data?.articleList ?? []
  const total = data?.totalNum ?? 0

  useRestoreListScroll(!loading && !error && articles.length > 0, tableScrollRef)

  const saveListScroll = () => {
    saveScrollPosition(
      `${location.pathname}${location.search}`,
      tableScrollRef.current?.scrollTop ?? 0,
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
      <section className="shrink-0 rounded-lg bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form className="relative" onSubmit={handleSearch}>
            <input
              value={draft}
              type="search"
              onChange={handleKeywordChange}
              maxLength={50}
              placeholder="按标题或摘要搜索"
              className="h-10 w-[420px] max-w-full rounded-md border border-[#dbe1ea] bg-white pr-[72px] pl-3 text-sm outline-none transition focus:border-[#09f]"
            />
            <button
              type="submit"
              className="absolute top-0 right-0 h-10 rounded-r-md bg-[#09f] px-4 text-sm cursor-pointer text-white hover:bg-[#0088e0]"
            >
              搜索
            </button>
          </form>
          <Link
            to={paths.adminPublish}
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-[#09f] px-4 text-sm font-medium text-white hover:bg-[#0088e0]"
          >
            发布文章
          </Link>
        </div>
      </section>

      {actionError && (
        <p className="shrink-0 rounded-md bg-[#e5484d]/8 px-4 py-3 text-sm text-[#e5484d]">
          {actionError}
        </p>
      )}

      <QueryStatus loading={loading} error={error} retry={retry}>
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          {articles.length === 0 ? (
            <p className="py-16 text-center text-[#888]">暂无文章</p>
          ) : (
            <div className="h-0 min-h-0 flex-1 overflow-x-auto">
              <table className="flex h-full min-w-[760px] w-full flex-col border-collapse text-left text-sm">
                <thead className="block shrink-0 bg-[#f7f9fc]">
                  <tr className="table w-full table-fixed text-[#667085]">
                    <th className="px-5 py-3.5 font-medium">标题</th>
                    <th className="w-28 px-3 py-3.5 font-medium">分类</th>
                    <th className="w-24 px-3 py-3.5 font-medium">标签</th>
                    <th className="w-20 px-3 py-3.5 font-medium">阅读</th>
                    <th className="w-44 px-3 py-3.5 font-medium">发布时间</th>
                    <th className="w-40 px-5 py-3.5 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody
                  ref={tableScrollRef}
                  className="block min-h-0 flex-1 overflow-y-auto overscroll-contain"
                >
                  {articles.map((item) => (
                    <tr
                      key={item.id}
                      className="table w-full table-fixed hover:bg-[#fafbfd]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1f2937]">{item.title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-[#98a2b3]">
                          {item.des}
                        </p>
                      </td>
                      <td className="w-28 px-3 py-4 text-[#667085]">
                        {findNavTitle(navList ?? [], item.nav_id)}
                      </td>
                      <td className="w-24 px-3 py-4">
                        {item.tag ? (
                          <span className="inline-flex rounded bg-[#eef6ff] px-2 py-0.5 text-xs text-[#09f]">
                            {item.tag}
                          </span>
                        ) : (
                          <span className="text-[#98a2b3]">—</span>
                        )}
                      </td>
                      <td className="w-20 px-3 py-4 text-[#667085]">
                        {item.read_count}
                      </td>
                      <td className="w-44 px-3 py-4 text-[#667085]">
                        {formatDateTime(item.publish_date)}
                      </td>
                      <td className="w-40 px-5 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            to={paths.article(item.id)}
                            className="text-[#09f] hover:underline"
                            onClick={saveListScroll}
                          >
                            查看
                          </Link>
                          <Link
                            to={paths.adminArticleEdit(item.id)}
                            className="text-[#09f] hover:underline"
                            onClick={saveListScroll}
                          >
                            编辑
                          </Link>
                          <button
                            type="button"
                            className="cursor-pointer text-[#e5484d] hover:underline"
                            onClick={() => void handleDelete(item.id, item.title)}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pager
            className="shrink-0 justify-end py-4 shadow-[0_-2px_8px_rgba(16,24,40,0.05)]"
            total={total}
            pageNum={pageNum}
            pageSize={pageSize}
            onPageChange={(num) => updateQuery({ pageNum: num })}
            onPageSizeChange={(size) => updateQuery({ pageNum: 1, pageSize: size })}
          />
        </section>
      </QueryStatus>
    </div>
  )
}
