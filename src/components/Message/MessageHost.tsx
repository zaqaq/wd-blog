import { Message } from '@/components/Message/Message.tsx'
import { useMessageStore } from '@/components/Message/store.ts'

export function MessageHost() {
  const list = useMessageStore((state) => state.list)
  const close = useMessageStore((state) => state.close)

  if (list.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[6000] flex flex-col items-center px-3">
      {list.map((item) => (
        <div key={item.id} className="pointer-events-auto mb-2 origin-top">
          <Message item={item} onClose={close} />
        </div>
      ))}
    </div>
  )
}
