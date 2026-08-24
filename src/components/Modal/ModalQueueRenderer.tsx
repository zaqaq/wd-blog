import { useEffect, useRef } from 'react'
import { Modal } from '@/components/Modal/Modal.tsx'
import type { ModalQueueEntry } from '@/components/Modal/store.ts'

type ModalQueueRendererProps = {
  entry: ModalQueueEntry | null
  onClose: (id: number, confirmed: boolean) => void
}

export function ModalQueueRenderer({ entry, onClose }: ModalQueueRendererProps) {
  const confirmedRef = useRef(false)

  useEffect(() => {
    confirmedRef.current = false
  }, [entry?.id])

  if (!entry) {
    return null
  }

  const { id, resolve: _resolve, open, ...props } = entry

  return (
    <Modal
      key={id}
      {...props}
      open={open}
      onConfirm={async () => {
        confirmedRef.current = true
        await props.onConfirm?.()
      }}
      onCancel={() => {
        confirmedRef.current = false
        props.onCancel?.()
      }}
      onClose={() => {
        const confirmed = confirmedRef.current
        confirmedRef.current = false
        props.onClose?.()
        onClose(id, confirmed)
      }}
    />
  )
}
