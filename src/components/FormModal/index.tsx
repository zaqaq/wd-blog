import {
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { Modal } from '@/components/Modal/Modal.tsx'
import type { ModalOrigin } from '@/components/Modal/types.ts'

export type FormModalHelpers<T> = {
  values: T
  setValues: Dispatch<SetStateAction<T>>
  setField: <K extends keyof T>(key: K, value: T[K]) => void
  error: string
  setError: (message: string) => void
}

export type FormModalProps<T> = {
  open: boolean
  title: string
  initialValues: T
  confirmText?: string
  cancelText?: string
  closable?: boolean
  origin?: ModalOrigin
  render: (helpers: FormModalHelpers<T>) => ReactNode
  validate?: (values: T) => string | null | void
  onSubmit: (values: T) => void | Promise<void>
  onClose: () => void
}

type FormBridge = {
  submit: () => Promise<void>
}

function FormModalBody<T>({
  initialValues,
  render,
  validate,
  onSubmit,
  bridge,
}: {
  initialValues: T
  render: (helpers: FormModalHelpers<T>) => ReactNode
  validate?: (values: T) => string | null | void
  onSubmit: (values: T) => void | Promise<void>
  bridge: FormBridge
}) {
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState('')
  const valuesRef = useRef(values)
  const validateRef = useRef(validate)
  const onSubmitRef = useRef(onSubmit)

  valuesRef.current = values
  validateRef.current = validate
  onSubmitRef.current = onSubmit

  useLayoutEffect(() => {
    bridge.submit = async () => {
      const current = valuesRef.current
      const message = validateRef.current?.(current)
      if (message) {
        setError(message)
        throw new Error(message)
      }
      setError('')
      await onSubmitRef.current(current)
    }
  }, [bridge])

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-3 text-[#1f2937]">
      {render({ values, setValues, setField, error, setError })}
      {error ? <p className="text-sm text-[#e5484d]">{error}</p> : null}
    </div>
  )
}

/** 独立表单弹窗：组合 Modal，不挂在 modal API 上 */
export function FormModal<T>({
  open,
  title,
  initialValues,
  confirmText = '保存',
  cancelText = '取消',
  closable = true,
  origin = 'center',
  render,
  validate,
  onSubmit,
  onClose,
}: FormModalProps<T>) {
  const bridgeRef = useRef<FormBridge>({
    submit: async () => {
      throw new Error('表单尚未就绪')
    },
  })

  return (
    <Modal
      open={open}
      type="confirm"
      showIcon={false}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      closable={closable}
      showCancel
      maskClosable={false}
      origin={origin}
      content={
        open ? (
          <FormModalBody
            key={JSON.stringify(initialValues)}
            initialValues={initialValues}
            render={render}
            validate={validate}
            onSubmit={onSubmit}
            bridge={bridgeRef.current}
          />
        ) : null
      }
      onConfirm={() => bridgeRef.current.submit()}
      onClose={onClose}
    />
  )
}
