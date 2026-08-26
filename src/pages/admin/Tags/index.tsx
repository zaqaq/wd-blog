import { useState, type MouseEvent } from 'react'
import {
  addTag,
  deleteTag,
  fetchAdminTagList,
  updateTag,
} from '@/api/tag.ts'
import { FormModal } from '@/components/FormModal/index.tsx'
import { useModal } from '@/components/Modal/index.tsx'
import type { ModalOrigin } from '@/components/Modal/types.ts'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { validateTagForm, type TagFormState } from '@/lib/adminTag.ts'
import { MAX_TAG_LENGTH } from '@/lib/articleForm.ts'
import { getErrorMessage } from '@/lib/error.ts'
import type { AdminTag } from '@/types/index.ts'

type TagFormMode =
  | { type: 'create'; origin: ModalOrigin }
  | { type: 'edit'; item: AdminTag; origin: ModalOrigin }

function clickOrigin(event?: MouseEvent): ModalOrigin {
  if (!event) {
    return 'center'
  }
  return { x: event.clientX, y: event.clientY }
}

const emptyForm: TagFormState = { name: '' }

const fieldClassName =
  'h-10 w-full rounded-md border border-[#dbe1ea] bg-white px-3 text-[#1f2937] outline-none transition focus:border-[#09f] disabled:opacity-60'

export default function AdminTagsPage() {
  const modal = useModal()
  const { data, loading, error, retry } = useAsyncResource(
    () => fetchAdminTagList(),
    'admin-tag-list',
  )
  const tagList = data?.tagList ?? []
  const [formSession, setFormSession] = useState(0)
  const [formMode, setFormMode] = useState<TagFormMode | null>(null)

  const openCreate = (event?: MouseEvent) => {
    setFormSession((session) => session + 1)
    setFormMode({ type: 'create', origin: clickOrigin(event) })
  }

  const openEdit = (item: AdminTag, event?: MouseEvent) => {
    setFormSession((session) => session + 1)
    setFormMode({ type: 'edit', item, origin: clickOrigin(event) })
  }

  const handleFormSubmit = async (values: TagFormState) => {
    if (!formMode) {
      return
    }
    const name = values.name.trim()
    try {
      if (formMode.type === 'create') {
        await addTag(name)
      } else {
        await updateTag(formMode.item.id, name)
      }
      retry()
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err))
    }
  }

  const handleDelete = async (
    item: AdminTag,
    origin?: MouseEvent | HTMLElement,
  ) => {
    const confirmed = await modal.error({
      title: '删除标签',
      content: `确定删除标签「${item.name}」？有文章占用时无法删除。`,
      confirmText: '删除',
      showCancel: true,
      maskClosable: false,
      origin: origin ?? 'center',
    })
    if (!confirmed) {
      return
    }
    try {
      await deleteTag(item.id)
      if (formMode?.type === 'edit' && formMode.item.id === item.id) {
        setFormMode(null)
      }
      window.$message.success(`已删除标签「${item.name}」`)
      retry()
    } catch (err: unknown) {
      window.$message.error(getErrorMessage(err))
    }
  }

  const existingNames = tagList.map((item) => item.name)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
      <section className="shrink-0 rounded-lg bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#1f2937]">标签管理</h1>
            <p className="mt-1 text-sm text-[#667085]">
              发文只能关联已有标签，有文章占用的不能删
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

      <QueryStatus
        loading={loading}
        error={error}
        retry={retry}
        fallback={<AdminArticlesSkeleton />}
      >
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#efeff5] bg-white">
          {tagList.length === 0 ? (
            <p className="py-16 text-center text-[#888]">暂无标签，请先新增</p>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="admin-table w-full min-w-[480px] border-collapse text-left text-sm">
                <thead className="bg-[#f7f9fc] text-[#667085]">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">名称</th>
                    <th className="w-28 px-3 py-3.5 font-medium">文章数</th>
                    <th className="w-40 px-5 py-3.5 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tagList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafbfd]">
                      <td className="px-5 py-4 font-medium text-[#1f2937]">
                        {item.name}
                      </td>
                      <td className="w-28 px-3 py-4 text-[#667085]">
                        {item.count}
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
                            className="cursor-pointer text-[#09f] hover:underline"
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
          title={formMode.type === 'create' ? '新增标签' : '编辑标签'}
          confirmText={formMode.type === 'create' ? '新增' : '保存'}
          origin={formMode.origin}
          initialValues={
            formMode.type === 'edit'
              ? { name: formMode.item.name }
              : emptyForm
          }
          validate={(values) =>
            validateTagForm(
              values,
              existingNames,
              formMode.type === 'edit' ? formMode.item.name : undefined,
            )
          }
          render={({ values, setField }) => (
            <label className="block text-sm">
              <span className="mb-1 block text-[#667085]">名称</span>
              <input
                value={values.name}
                maxLength={MAX_TAG_LENGTH}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="如：React"
                className={fieldClassName}
              />
            </label>
          )}
          onSubmit={handleFormSubmit}
          onClose={() => setFormMode(null)}
        />
      ) : null}
    </div>
  )
}
