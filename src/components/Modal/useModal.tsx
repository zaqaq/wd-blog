import { modal, type ModalApi } from '@/components/Modal/store.ts'

/**
 * 用法：const modal = useModal()
 * 弹层由根节点 ModalHost 统一渲染，无需 contextHolder。
 */
export function useModal(): ModalApi {
  return modal
}
