import { useEffect, useState, type SubmitEvent } from 'react'
import {
  fetchSideBar,
  updateIntro,
  updateNotice,
} from '@/api/nav.ts'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { formatDateTime } from '@/lib/datetime.ts'
import { getErrorMessage } from '@/lib/error.ts'

export default function AdminSiteSettingsPage() {
  const { data, loading, error, retry } = useAsyncResource(
    () => fetchSideBar(),
    'admin-site-settings',
  )
  const [intro, setIntro] = useState('')
  const [notice, setNotice] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [savingIntro, setSavingIntro] = useState(false)
  const [savingNotice, setSavingNotice] = useState(false)
  const [introError, setIntroError] = useState('')
  const [noticeError, setNoticeError] = useState('')

  useEffect(() => {
    if (!data) {
      return
    }
    setIntro(data.intro)
    setNotice(data.notice)
  }, [data])

  const handleSaveIntro = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = intro.trim()
    if (value.length < 1 || value.length > 500) {
      setIntroError('简介长度为 1～500 字')
      return
    }
    setSavingIntro(true)
    setIntroError('')
    try {
      const result = await updateIntro(value)
      setIntro(result.intro)
      setNotice(result.notice)
      setUpdatedAt(result.updated_at)
    } catch (err: unknown) {
      setIntroError(getErrorMessage(err))
    } finally {
      setSavingIntro(false)
    }
  }

  const handleSaveNotice = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = notice.trim()
    if (value.length < 1 || value.length > 1000) {
      setNoticeError('公告长度为 1～1000 字')
      return
    }
    setSavingNotice(true)
    setNoticeError('')
    try {
      const result = await updateNotice(value)
      setIntro(result.intro)
      setNotice(result.notice)
      setUpdatedAt(result.updated_at)
    } catch (err: unknown) {
      setNoticeError(getErrorMessage(err))
    } finally {
      setSavingNotice(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <section className="rounded-lg bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="mb-5 border-b border-[#f0f0f0] pb-4">
          <h1 className="text-xl font-semibold text-[#1f2937]">站点设置</h1>
          <p className="mt-1 text-sm text-[#667085]">
            修改侧栏展示的博主简介与公告
          </p>
          <p className="mt-1 min-h-[16px] text-xs text-[#999]">
            {updatedAt ? `最近保存：${formatDateTime(updatedAt)}` : '\u00A0'}
          </p>
        </div>

        <QueryStatus
          loading={loading}
          error={error}
          retry={retry}
          fallback={
            <div className="space-y-4 py-2" aria-busy aria-label="加载中">
              <div className="h-4 w-24 rounded bg-[#eef1f6]" />
              <div className="h-28 rounded bg-[#eef1f6]" />
              <div className="h-4 w-24 rounded bg-[#eef1f6]" />
              <div className="h-36 rounded bg-[#eef1f6]" />
            </div>
          }
        >
          <div className="space-y-8">
            <form onSubmit={handleSaveIntro} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="site-intro"
                  className="text-sm font-medium text-[#333]"
                >
                  博主简介
                </label>
                <span className="text-xs text-[#999]">{intro.length}/500</span>
              </div>
              <textarea
                id="site-intro"
                value={intro}
                maxLength={500}
                rows={5}
                disabled={savingIntro}
                onChange={(event) => setIntro(event.target.value)}
                className="w-full resize-y rounded-[3px] border border-[#ced3d9] px-3 py-2 text-sm outline-none transition focus:border-[#09f] disabled:opacity-60"
              />
              {introError && (
                <p className="text-sm text-[#e74c3c]">{introError}</p>
              )}
              <button
                type="submit"
                disabled={savingIntro}
                className="inline-flex h-9 min-w-[88px] cursor-pointer items-center justify-center rounded-[3px] bg-[#09f] px-4 text-sm text-white transition hover:bg-[#0088ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingIntro ? '保存中…' : '保存简介'}
              </button>
            </form>

            <form onSubmit={handleSaveNotice} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="site-notice"
                  className="text-sm font-medium text-[#333]"
                >
                  公告
                </label>
                <span className="text-xs text-[#999]">{notice.length}/1000</span>
              </div>
              <textarea
                id="site-notice"
                value={notice}
                maxLength={1000}
                rows={6}
                disabled={savingNotice}
                onChange={(event) => setNotice(event.target.value)}
                className="w-full resize-y rounded-[3px] border border-[#ced3d9] px-3 py-2 text-sm outline-none transition focus:border-[#09f] disabled:opacity-60"
              />
              {noticeError && (
                <p className="text-sm text-[#e74c3c]">{noticeError}</p>
              )}
              <button
                type="submit"
                disabled={savingNotice}
                className="inline-flex h-9 min-w-[88px] cursor-pointer items-center justify-center rounded-[3px] bg-[#09f] px-4 text-sm text-white transition hover:bg-[#0088ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingNotice ? '保存中…' : '保存公告'}
              </button>
            </form>
          </div>
        </QueryStatus>
      </section>
    </div>
  )
}
