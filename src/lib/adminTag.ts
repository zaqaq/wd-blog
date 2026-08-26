import { MAX_TAG_LENGTH } from '@/lib/articleForm.ts'

export type TagFormState = {
  name: string
}

export function validateTagForm(
  values: TagFormState,
  existingNames: string[],
  excludeName?: string,
) {
  const name = values.name.trim()
  if (!name || name.length > MAX_TAG_LENGTH) {
    return `标签名为 1～${MAX_TAG_LENGTH} 字`
  }
  const taken = existingNames.some(
    (item) => item === name && item !== excludeName,
  )
  if (taken) {
    return '标签已存在'
  }
  return null
}
