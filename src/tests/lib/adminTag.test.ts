import { describe, expect, it } from 'vitest'
import { validateTagForm } from '@/lib/adminTag.ts'

describe('validateTagForm', () => {
  it('名称为空或过长', () => {
    expect(validateTagForm({ name: '  ' }, [])).toBe('标签名为 1～20 字')
    expect(validateTagForm({ name: 'a'.repeat(21) }, [])).toBe(
      '标签名为 1～20 字',
    )
  })

  it('重名', () => {
    expect(validateTagForm({ name: 'React' }, ['React'])).toBe('标签已存在')
  })

  it('编辑自身同名可通过', () => {
    expect(validateTagForm({ name: 'React' }, ['React'], 'React')).toBe(null)
  })

  it('合法名称返回 null', () => {
    expect(validateTagForm({ name: 'TypeScript' }, ['React'])).toBe(null)
  })
})
