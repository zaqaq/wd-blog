import { lazy, Suspense } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'

const CodeBlock = lazy(async () => {
  const [{ Prism }, { dracula }] = await Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism'),
  ])

  function Highlighter({ language, code }: { language: string; code: string }) {
    return (
      <Prism
        showLineNumbers
        lineNumberStyle={{ minWidth: 0 }}
        style={dracula}
        language={language}
        PreTag="div"
      >
        {code}
      </Prism>
    )
  }

  return { default: Highlighter }
})

const components: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className ?? '')
    const code = String(children).replace(/\n$/, '')
    if (!match) {
      return <code className={className}>{children}</code>
    }

    return (
      <Suspense fallback={<pre className="overflow-auto p-3">{code}</pre>}>
        <CodeBlock language={match[1]} code={code} />
      </Suspense>
    )
  },
}

export function MarkdownContent({ content }: { content?: string }) {
  return (
    <div className="markdown-contents">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content ?? ''}
      </Markdown>
    </div>
  )
}
