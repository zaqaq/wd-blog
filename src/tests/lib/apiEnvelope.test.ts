import { describe, expect, it } from 'vitest'
import { isApiEnvelope, unwrapApiBody } from '@/lib/apiEnvelope.ts'

describe('unwrapApiBody', () => {
  it('剥开统一外壳，返回 data', () => {
    expect(
      unwrapApiBody({
        code: 200,
        message: 'ok',
        data: { totalNum: 1, articleList: [] },
      }),
    ).toEqual({ totalNum: 1, articleList: [] })
  })

  it('data 为 null 时原样返回', () => {
    expect(unwrapApiBody({ code: 404, message: '文章不存在', data: null })).toBe(
      null,
    )
  })

  it('非外壳响应原样返回', () => {
    expect(unwrapApiBody({ status: 'ok' })).toEqual({ status: 'ok' })
    expect(unwrapApiBody({ code: true })).toEqual({ code: true })
  })
})

describe('isApiEnvelope', () => {
  it('要求 code 为数字且含 message / data', () => {
    expect(isApiEnvelope({ code: 200, message: 'ok', data: {} })).toBe(true)
    expect(isApiEnvelope({ code: true, message: 'ok', data: {} })).toBe(false)
    expect(isApiEnvelope([{ code: 200 }])).toBe(false)
  })
})
