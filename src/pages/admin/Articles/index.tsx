import { useRef, useState, type ChangeEvent, type MouseEvent, type SubmitEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  deleteArticle,
  fetchAdminArticleList,
  setArticleStatus,
} from '@/api/article.ts'
import { DEFAULT_PAGE_SIZE, Pager, parsePageSize } from '@/components/Pager/index.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { useModal } from '@/components/Modal/index.tsx'
import { Select } from '@/components/Select/index.tsx'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'
import { TableActions } from '@/components/TableActions/index.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { useHeaderNav } from '@/hooks/useBlogData.ts'
import { useRestoreListScroll } from '@/hooks/useRestoreListScroll.ts'
import {
  articleStatusLabel,
  canDeleteArticle,
  formatTagInput,
  isPubliclyVisible,
  parseArticleStatus,
  patchArticleListStatus,
} from '@/lib/articleForm.ts'
import { formatDateTime } from '@/lib/datetime.ts'
import { getErrorMessage } from '@/lib/error.ts'
import { findNavTitle } from '@/lib/nav.ts'
import { parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'
import { saveScrollPosition } from '@/lib/scroll.ts'
import type { ArticleStatus } from '@/types/index.ts'

const statusFilterOptions = [
  { value: '', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'unpublished', label: '已下架' },
] as const

export default function AdminArticlesPage() {
  const modal = useModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = parsePositiveInt(searchParams.get('pageNum') ?? undefined)
  const pageSize = parsePageSize(searchParams.get('pageSize'))
  const keyword = (searchParams.get('key') ?? '').trim()
  const status = parseArticleStatus(searchParams.get('status'))
  const [draft, setDraft] = useState(keyword)
  const [actionError, setActionError] = useState('')
  const tableScrollRef = useRef<HTMLTableSectionElement>(null)
  const location = useLocation()
  const { data: navList } = useHeaderNav()
  const { data, loading, error, retry, mutate } = useAsyncResource(
    () => fetchAdminArticleList(pageNum, pageSize, keyword || undefined, status),
    `admin-articles:${pageNum}:${pageSize}:${keyword}:${status ?? ''}`,
  )

  const updateQuery = (next: {
    pageNum?: number
    pageSize?: number
    key?: string
    status?: ArticleStatus | ''
  }) => {
    const params = new URLSearchParams()
    const nextPage = next.pageNum ?? pageNum
    const nextSize = next.pageSize ?? pageSize
    const nextKey = next.key ?? keyword
    const nextStatus = next.status === undefined ? status ?? '' : next.status
    if (nextPage > 1) {
      params.set('pageNum', String(nextPage))
    }
    if (nextSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', String(nextSize))
    }
    if (nextKey) {
      params.set('key', nextKey)
    }
    if (nextStatus) {
      params.set('status', nextStatus)
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

  const handleDelete = async (
    id: number,
    title: string,
    status: ArticleStatus,
    origin?: MouseEvent | HTMLElement,
  ) => {
    if (!canDeleteArticle(status)) {
      window.$message.warning('上架中的文章不能删除，请先下架')
      return
    }
    const confirmed = await modal.error({
      title: '删除文章',
      content: `确定删除「${title}」？删除后无法恢复。`,
      confirmText: '删除',
      showCancel: true,
      maskClosable: false,
      origin: origin ?? 'center',
    })
    if (!confirmed) {
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

  const handleSetStatus = async (
    id: number,
    nextStatus: ArticleStatus,
    title: string,
  ) => {
    const action = nextStatus === 'unpublished' ? '下架' : '上架'
    const confirmed = await modal.confirm({
      title: `${action}文章`,
      content: `确定${action}「${title}」？`,
      confirmText: action,
      showCancel: true,
      maskClosable: false,
      origin: 'center',
    })
    if (!confirmed) {
      return
    }
    try {
      await setArticleStatus(id, nextStatus)
      mutate((current) => ({
        ...current,
        articleList: patchArticleListStatus(
          current.articleList,
          id,
          nextStatus,
        ),
      }))
      window.$message.success(`已${action}「${title}」`)
    } catch (err: unknown) {
      window.$message.error(getErrorMessage(err))
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
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <form className="relative" onSubmit={handleSearch}>
              <input
                value={draft}
                type="search"
                onChange={handleKeywordChange}
                maxLength={50}
                placeholder="按标题或摘要搜索"
                className="h-10 w-[320px] max-w-full rounded-md border border-[#dbe1ea] bg-white pr-[72px] pl-3 text-sm outline-none transition focus:border-[#09f]"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 h-10 rounded-r-md bg-[#09f] px-4 text-sm cursor-pointer text-white hover:bg-[#0088e0]"
              >
                搜索
              </button>
            </form>
            <Select
              size="md"
              className="w-[140px] shrink-0"
              value={status ?? ''}
              options={statusFilterOptions}
              onChange={(value) =>
                updateQuery({
                  pageNum: 1,
                  status: parseArticleStatus(value) ?? '',
                })
              }
            />
          </div>
          <Link
            to={paths.adminPublish}
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-[#09f] px-4 text-sm font-medium text-white hover:bg-[#0088e0]"
          >
            写文章
          </Link>
        </div>
      </section>

      {actionError && (
        <p className="shrink-0 rounded-md bg-[#e5484d]/8 px-4 py-3 text-sm text-[#e5484d]">
          {actionError}
        </p>
      )}

      <QueryStatus
        loading={loading}
        error={error}
        retry={retry}
        fallback={<AdminArticlesSkeleton />}
      >
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#efeff5] bg-white">
          {articles.length === 0 ? (
            <p className="py-16 text-center text-[#888]">暂无文章</p>
          ) : (
            <div className="h-0 min-h-0 flex-1 overflow-x-auto">
              <table className="admin-table flex h-full min-w-[920px] w-full flex-col border-collapse text-left text-sm">
                <thead className="block shrink-0 bg-[#f7f9fc]">
                  <tr className="table w-full table-fixed text-[#667085]">
                    <th className="px-5 py-3.5 font-medium">标题</th>
                    <th className="w-24 px-3 py-3.5 font-medium">分类</th>
                    <th className="w-32 px-3 py-3.5 font-medium">标签</th>
                    <th className="w-20 px-3 py-3.5 font-medium">状态</th>
                    <th className="w-16 px-3 py-3.5 font-medium">阅读</th>
                    <th className="w-40 px-3 py-3.5 font-medium">发布时间</th>
                    <th className="w-40 px-5 py-3.5 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody
                  ref={tableScrollRef}
                  className="block min-h-0 flex-1 overflow-y-auto overscroll-contain"
                >
                  {articles.map((item) => {
                    const tagsLabel = formatTagInput(item.tags, item.tag)
                    const canView = isPubliclyVisible(
                      item.status,
                      item.scheduled_at,
                    )
                    return (
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
                        <td className="w-24 px-3 py-4 text-[#667085]">
                          {findNavTitle(navList ?? [], item.nav_id)}
                        </td>
                        <td className="w-32 px-3 py-4">
                          {tagsLabel ? (
                            <span className="line-clamp-2 text-xs text-[#09f]">
                              {tagsLabel}
                            </span>
                          ) : (
                            <span className="text-[#98a2b3]">—</span>
                          )}
                        </td>
                        <td className="w-20 px-3 py-4 text-[#667085]">
                          {articleStatusLabel(item.status, item.scheduled_at)}
                        </td>
                        <td className="w-16 px-3 py-4 text-[#667085]">
                          {item.read_count}
                        </td>
                        <td className="w-40 px-3 py-4 text-[#667085]">
                          {formatDateTime(item.publish_date)}
                        </td>
                        <td className="w-40 px-5 py-4">
                          <TableActions
                            items={[
                              ...(canView
                                ? [
                                    {
                                      key: 'view',
                                      label: '查看',
                                      to: paths.article(item.id),
                                      onClick: saveListScroll,
                                    },
                                  ]
                                : []),
                              {
                                key: 'edit',
                                label: '编辑',
                                to: paths.adminArticleEdit(item.id),
                                onClick: saveListScroll,
                              },
                              ...(item.status === 'published'
                                ? [
                                    {
                                      key: 'unpublish',
                                      label: '下架',
                                      onClick: () =>
                                        void handleSetStatus(
                                          item.id,
                                          'unpublished',
                                          item.title,
                                        ),
                                    },
                                  ]
                                : []),
                              ...(item.status === 'unpublished' ||
                              item.status === 'draft'
                                ? [
                                    {
                                      key: 'publish',
                                      label: '上架',
                                      onClick: () =>
                                        void handleSetStatus(
                                          item.id,
                                          'published',
                                          item.title,
                                        ),
                                    },
                                  ]
                                : []),
                              ...(canDeleteArticle(item.status)
                                ? [
                                    {
                                      key: 'delete',
                                      label: '删除',
                                      onClick: (event: MouseEvent) =>
                                        void handleDelete(
                                          item.id,
                                          item.title,
                                          item.status,
                                          event,
                                        ),
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Pager
            className="shrink-0 justify-end border-t border-[#efeff5] py-4"
            total={total}
            pageNum={pageNum}
            pageSize={pageSize}
            onPageChange={(num) => updateQuery({ pageNum: num })}
            onPageSizeChange={(size) =>
              updateQuery({ pageNum: 1, pageSize: size })
            }
          />
        </section>
      </QueryStatus>
    </div>
  )
}
