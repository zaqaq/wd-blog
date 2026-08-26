import MDEditor from '@uiw/react-md-editor'
import { ImageUploadButton } from '@/components/ImageUploadButton.tsx'
import { MarkdownContent } from '@/components/MarkdownContent.tsx'
import '@uiw/react-md-editor/markdown-editor.css'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
}

function insertMarkdownImage(markdown: string, url: string) {
  const snippet = `![](${url})`
  if (!markdown.trim()) {
    return snippet
  }
  return markdown.endsWith('\n') ? `${markdown}${snippet}\n` : `${markdown}\n\n${snippet}\n`
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="space-y-3">
      <ImageUploadButton
        label="插入图片"
        onUploaded={(url) => onChange(insertMarkdownImage(value, url))}
      />
      <div className="grid min-h-[520px] gap-3 lg:grid-cols-2">
        <div
          data-color-mode="light"
          className="md-editor-host min-h-[520px] overflow-hidden rounded-md border border-[#dbe1ea] bg-white"
        >
          <MDEditor
            value={value}
            onChange={(next) => onChange(next ?? '')}
            preview="edit"
            height={520}
            visibleDragbar={false}
            highlightEnable={false}
            extraCommands={[]}
            textareaProps={{
              placeholder: '使用 Markdown 撰写正文…',
            }}
          />
        </div>
        <div className="h-[520px] overflow-auto rounded-md border border-[#dbe1ea] bg-[#fafbfd] px-4 py-3">
          <p className="mb-2 text-xs font-medium tracking-wide text-[#98a2b3]">
            实时预览
          </p>
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-[#98a2b3]">正文预览会显示在这里</p>
          )}
        </div>
      </div>
    </div>
  )
}
