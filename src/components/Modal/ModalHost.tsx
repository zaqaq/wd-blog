import { ModalQueueRenderer } from '@/components/Modal/ModalQueueRenderer.tsx'
import { useModalStore } from '@/components/Modal/store.ts'

/** 挂在应用根节点，承接 useModal() / modal 的命令式调用 */
export function ModalHost() {
  const queue = useModalStore((state) => state.queue)
  const close = useModalStore((state) => state.close)

  return <ModalQueueRenderer entry={queue[0] ?? null} onClose={close} />
}
