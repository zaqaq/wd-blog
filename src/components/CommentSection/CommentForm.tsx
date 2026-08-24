import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { getErrorMessage } from '@/lib/error.ts'
import type { ReplyTarget } from '@/hooks/useArticleComments.ts'

type CommentFormProps = {
  defaultNickname: string
  replyTo: ReplyTarget | null
  submitting: boolean
  onCancelReply: () => void
  onSubmit: (
    nickname: string,
    content: string,
  ) => Promise<{ pending?: boolean; commentId?: number } | void>
}

export function CommentForm({
  defaultNickname,
  replyTo,
  submitting,
  onCancelReply,
  onSubmit,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [nickname, setNickname] = useState(defaultNickname)
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!replyTo) {
      return
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const timer = window.setTimeout(() => {
      contentRef.current?.focus()
    }, 300)
    return () => window.clearTimeout(timer)
  }, [replyTo])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const trimmedNickname = nickname.trim()
    const trimmedContent = content.trim()

    if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
      setFormError('昵称长度为 2～20 字')
      return
    }
    if (trimmedContent.length < 1 || trimmedContent.length > 1000) {
      setFormError('评论内容为 1～1000 字')
      return
    }

    try {
      await onSubmit(trimmedNickname, trimmedContent)
      setContent('')
    } catch (err: unknown) {
      setFormError(getErrorMessage(err))
    }
  }

  return (
    <form
      ref={formRef}
      id="comment-form"
      onSubmit={handleSubmit}
      className="rounded border border-[#e6ecf2] bg-[#fafbfc] p-4"
    >
      {replyTo && (
        <div className="mb-3 flex items-center justify-between text-sm text-[#666]">
          <span>
            回复 <strong className="text-[#09f]">@{replyTo.nickname}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="cursor-pointer text-[#999] transition hover:text-[#09f]"
          >
            取消回复
          </button>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="comment-nickname" className="mb-1 block text-sm text-[#666]">
          昵称
        </label>
        <input
          id="comment-nickname"
          type="text"
          value={nickname}
          maxLength={20}
          placeholder="2～20 字"
          onChange={(event) => setNickname(event.target.value)}
          className="w-full rounded border border-[#ced3d9] px-3 py-2 text-sm outline-none transition focus:border-[#09f]"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="comment-content" className="mb-1 block text-sm text-[#666]">
          评论
        </label>
        <textarea
          ref={contentRef}
          id="comment-content"
          value={content}
          maxLength={1000}
          rows={4}
          placeholder="写下你的想法…"
          onChange={(event) => setContent(event.target.value)}
          className="w-full resize-y rounded border border-[#ced3d9] px-3 py-2 text-sm outline-none transition focus:border-[#09f]"
        />
        <p className="mt-1 text-right text-xs text-[#999]">{content.length}/1000</p>
      </div>

      {/* 蜜罐字段，真实用户不可见 */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      {formError && (
        <p className="mb-3 text-sm text-[#e74c3c]">{formError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded bg-[#09f] px-5 py-2 text-sm text-white transition hover:bg-[#0088ee] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? '提交中…' : replyTo ? '发表回复' : '发表评论'}
      </button>
    </form>
  )
}
