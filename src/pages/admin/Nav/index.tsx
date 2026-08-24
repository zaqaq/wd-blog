import { useMemo, useState, type MouseEvent } from 'react'
import {
  addNav,
  deleteNav,
  fetchAdminNavList,
  updateNav,
} from '@/api/nav.ts'
import { FormModal } from '@/components/FormModal/index.tsx'
import { useModal } from '@/components/Modal/index.tsx'
import type { ModalOrigin } from '@/components/Modal/types.ts'
import { Select } from '@/components/Select/index.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { getErrorMessage } from '@/lib/error.ts'
import type { AdminNavItem } from '@/types/index.ts'

type NavFormState = {
  title: string
  parent_id: string
}

type NavFormMode =
  | { type: 'create'; origin: ModalOrigin }
  | { type: 'edit'; item: AdminNavItem; origin: ModalOrigin }

function clickOrigin(event?: MouseEvent): ModalOrigin {
  if (!event) {
    return 'center'
  }
  return { x: event.clientX, y: event.clientY }
}

const emptyForm: NavFormState = {
  title: '',
  parent_id: '0',
}

const fieldClassName =
  'h-10 w-full rounded-md border border-[#dbe1ea] bg-white px-3 text-[#1f2937] outline-none transition focus:border-[#09f] disabled:opacity-60'

function buildTreeRows(navList: AdminNavItem[]) {
  const tops = navList.filter((item) => item.parent_id === 0)
  const childrenByParent = new Map<number, AdminNavItem[]>()
  for (const item of navList) {
    if (item.parent_id === 0) {
      continue
    }
    const list = childrenByParent.get(item.parent_id) ?? []
    list.push(item)
    childrenByParent.set(item.parent_id, list)
  }

  const rows: Array<AdminNavItem & { depth: number }> = []
  for (const top of tops) {
    rows.push({ ...top, depth: 0 })
    for (const child of childrenByParent.get(top.nav_id) ?? []) {
      rows.push({ ...child, depth: 1 })
    }
  }

  const shown = new Set(rows.map((item) => item.id))
  for (const item of navList) {
    if (!shown.has(item.id)) {
      rows.push({ ...item, depth: item.parent_id === 0 ? 0 : 1 })
    }
  }
  return rows
}

function nextNavId(navList: AdminNavItem[]) {
  if (navList.length === 0) {
    return 101
  }
  return Math.max(...navList.map((item) => item.nav_id)) + 1
}

function validateNavForm(
  values: NavFormState,
  topNavs: AdminNavItem[],
  excludeId?: number,
) {
  const title = values.title.trim()
  const parentId = Number(values.parent_id)

  if (!title || title.length > 255) {
    return '标题长度为 1～255 字'
  }
  if (!Number.isInteger(parentId) || parentId < 0) {
    return '父级不合法'
  }
  if (
    parentId !== 0 &&
    !topNavs.some((item) => item.nav_id === parentId && item.id !== excludeId)
  ) {
    return '父级须为已有顶级导航'
  }
  return null
}

function NavFormFields({
  values,
  setField,
  parentOptions,
  disabled = false,
}: {
  values: NavFormState
  setField: <K extends keyof NavFormState>(
    key: K,
    value: NavFormState[K],
  ) => void
  parentOptions: AdminNavItem[]
  disabled?: boolean
}) {
  return (
    <>
      <label className="block text-sm">
        <span className="mb-1 block text-[#667085]">标题</span>
        <input
          value={values.title}
          maxLength={255}
          disabled={disabled}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="如：前端"
          className={fieldClassName}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[#667085]">父级</span>
        <Select
          value={values.parent_id}
          disabled={disabled}
          onChange={(value) => setField('parent_id', value)}
          options={[
            { value: '0', label: '无（顶级）' },
            ...parentOptions.map((item) => ({
              value: String(item.nav_id),
              label: item.title,
            })),
          ]}
        />
      </label>
    </>
  )
}

export default function AdminNavPage() {
  const modal = useModal()
  const { data, loading, error, retry } = useAsyncResource(
    () => fetchAdminNavList(),
    'admin-nav-list',
  )
  const navList = data?.navList ?? []
  const rows = useMemo(() => buildTreeRows(navList), [navList])
  const topNavs = useMemo(
    () => navList.filter((item) => item.parent_id === 0),
    [navList],
  )
  const titleByNavId = useMemo(() => {
    const map = new Map<number, string>()
    for (const item of navList) {
      map.set(item.nav_id, item.title)
    }
    return map
  }, [navList])

  const [actionError, setActionError] = useState('')
  const [formSession, setFormSession] = useState(0)
  const [formMode, setFormMode] = useState<NavFormMode | null>(null)

  const openCreate = (event?: MouseEvent) => {
    setFormSession((session) => session + 1)
    setFormMode({ type: 'create', origin: clickOrigin(event) })
  }

  const openEdit = (item: AdminNavItem, event?: MouseEvent) => {
    setFormSession((session) => session + 1)
    setFormMode({ type: 'edit', item, origin: clickOrigin(event) })
  }

  const handleFormSubmit = async (values: NavFormState) => {
    if (!formMode) {
      return
    }
    try {
      if (formMode.type === 'create') {
        await addNav({
          title: values.title.trim(),
          nav_id: nextNavId(navList),
          parent_id: Number(values.parent_id),
        })
      } else {
        await updateNav(formMode.item.id, {
          title: values.title.trim(),
          parent_id: Number(values.parent_id),
        })
      }
      setActionError('')
      retry()
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err))
    }
  }

  const handleDelete = async (
    item: AdminNavItem,
    origin?: MouseEvent | HTMLElement,
  ) => {
    const levelLabel = item.parent_id === 0 ? '顶级导航' : '二级导航'
    const confirmed = await modal.error({
      title: '删除导航',
      content: `确定删除${levelLabel}「${item.title}」？有子导航或文章时无法删除。`,
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
      await deleteNav(item.id)
      if (formMode?.type === 'edit' && formMode.item.id === item.id) {
        setFormMode(null)
      }
      retry()
    } catch (err: unknown) {
      setActionError(getErrorMessage(err))
    }
  }

  const formParentOptions =
    formMode?.type === 'edit'
      ? topNavs.filter((item) => item.id !== formMode.item.id)
      : topNavs

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
      <section className="shrink-0 rounded-lg bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#1f2937]">导航管理</h1>
            <p className="mt-1 text-sm text-[#667085]">
              配置前台头部导航，仅支持两级
            </p>
          </div>
          <button
            type="button"
            onClick={(event) => openCreate(event)}
            className="h-10 shrink-0 cursor-pointer rounded-md bg-[#09f] px-4 text-sm text-white transition hover:bg-[#0088e0]"
          >
            新增
          </button>
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
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          {rows.length === 0 ? (
            <p className="py-16 text-center text-[#888]">暂无导航，请先新增</p>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-[#f7f9fc] text-[#667085]">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">标题</th>
                    <th className="w-28 px-3 py-3.5 font-medium">级别</th>
                    <th className="w-40 px-3 py-3.5 font-medium">父级</th>
                    <th className="w-40 px-5 py-3.5 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafbfd]">
                      <td className="px-5 py-4">
                        <span
                          className={
                            item.depth > 0
                              ? 'pl-6 text-[#475467]'
                              : 'font-medium text-[#1f2937]'
                          }
                        >
                          {item.depth > 0 ? '└ ' : ''}
                          {item.title}
                        </span>
                      </td>
                      <td className="w-28 px-3 py-4 text-[#667085]">
                        {item.parent_id === 0 ? '顶级' : '二级'}
                      </td>
                      <td className="w-40 px-3 py-4 text-[#667085]">
                        {item.parent_id === 0
                          ? '—'
                          : (titleByNavId.get(item.parent_id) ?? '—')}
                      </td>
                      <td className="w-40 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="cursor-pointer text-[#09f] hover:underline"
                            onClick={(event) => openEdit(item, event)}
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            className="cursor-pointer text-[#e5484d] hover:underline"
                            onClick={(event) => void handleDelete(item, event)}
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
        </section>
      </QueryStatus>

      {formMode ? (
        <FormModal
          key={formSession}
          open
          title={formMode.type === 'create' ? '新增导航' : '编辑导航'}
          confirmText={formMode.type === 'create' ? '新增' : '保存'}
          origin={formMode.origin}
          initialValues={
            formMode.type === 'edit'
              ? {
                  title: formMode.item.title,
                  parent_id: String(formMode.item.parent_id),
                }
              : emptyForm
          }
          validate={(values) =>
            validateNavForm(
              values,
              topNavs,
              formMode.type === 'edit' ? formMode.item.id : undefined,
            )
          }
          render={({ values, setField }) => (
            <NavFormFields
              values={values}
              setField={setField}
              parentOptions={formParentOptions}
            />
          )}
          onSubmit={handleFormSubmit}
          onClose={() => setFormMode(null)}
        />
      ) : null}
    </div>
  )
}
