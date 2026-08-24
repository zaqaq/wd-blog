import { isAxiosError } from 'axios'

function readResponseMessage(data: unknown) {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = data.message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }
  return null
}

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) {
      return '网络异常，请确认后端已在 localhost:3001 运行'
    }
    return (
      readResponseMessage(error.response.data) ??
      `请求失败（${error.response.status}）`
    )
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return '加载失败，请稍后重试'
}
