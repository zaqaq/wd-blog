import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { getErrorMessage } from '@/lib/error.ts'

function axiosError(options: {
  status?: number
  data?: unknown
  noResponse?: boolean
}) {
  if (options.noResponse) {
    return new AxiosError('Network Error')
  }
  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      status: options.status ?? 400,
      data: options.data,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    },
  )
}

describe('getErrorMessage', () => {
  it('无响应时提示后端未启动', () => {
    expect(getErrorMessage(axiosError({ noResponse: true }))).toBe(
      '网络异常，请确认后端已在 localhost:3001 运行',
    )
  })

  it('优先使用接口返回的 message', () => {
    expect(
      getErrorMessage(axiosError({ status: 400, data: { message: '标题已存在' } })),
    ).toBe('标题已存在')
  })

  it('没有 message 时回退到状态码', () => {
    expect(getErrorMessage(axiosError({ status: 500, data: {} }))).toBe(
      '请求失败（500）',
    )
  })

  it('普通 Error 使用其 message', () => {
    expect(getErrorMessage(new Error('父级不合法'))).toBe('父级不合法')
  })

  it('未知错误使用兜底文案', () => {
    expect(getErrorMessage('boom')).toBe('加载失败，请稍后重试')
  })
})
