import { useRef, useState, type ChangeEvent } from 'react'
import { uploadImage } from '@/api/article.ts'
import { getErrorMessage } from '@/lib/error.ts'

type ImageUploadButtonProps = {
  label: string
  onUploaded: (url: string) => void
  disabled?: boolean
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export function ImageUploadButton({
  label,
  onUploaded,
  disabled = false,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) {
      return
    }
    setUploading(true)
    setError('')
    try {
      const result = await uploadImage(file)
      onUploaded(result.url)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[#dbe1ea] bg-white px-3 text-sm text-[#344054] hover:border-[#09f] hover:text-[#09f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? '上传中…' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => void handleChange(event)}
      />
      {error ? (
        <p className="mt-1.5 text-sm text-[#e5484d]">{error}</p>
      ) : null}
    </div>
  )
}
