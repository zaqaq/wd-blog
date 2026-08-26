import { describe, expect, it } from 'vitest'
import {
  buildMessagePayload,
  removeMessageById,
  resolveMessageDuration,
  upsertMessageList,
} from '@/lib/message.ts'

describe('resolveMessageDuration', () => {
  it('默认 3 秒，0 或负数表示不自动关闭', () => {
    expect(resolveMessageDuration()).toBe(3000)
    expect(resolveMessageDuration(5000)).toBe(5000)
    expect(resolveMessageDuration(0)).toBe(0)
    expect(resolveMessageDuration(-1)).toBe(0)
  })
})

describe('buildMessagePayload', () => {
  it('支持字符串和对象两种入参', () => {
    expect(buildMessagePayload('success', '已保存')).toEqual({
      type: 'success',
      content: '已保存',
      duration: 3000,
      closable: true,
    })
    expect(
      buildMessagePayload('info', {
        content: '注意',
        duration: 0,
        key: 'notice',
      }),
    ).toEqual({
      type: 'info',
      content: '注意',
      duration: 0,
      closable: true,
      key: 'notice',
    })
  })
})

describe('upsertMessageList', () => {
  const a = {
    id: 1,
    type: 'info' as const,
    content: 'a',
    duration: 3000,
    closable: true,
    key: 'same',
  }
  const b = {
    id: 2,
    type: 'success' as const,
    content: 'b',
    duration: 3000,
    closable: true,
    key: 'same',
  }

  it('同 key 替换，超出上限丢掉最早的', () => {
    expect(upsertMessageList([a], b)).toEqual([b])
    const items = [1, 2, 3, 4, 5].map((id) => ({
      id,
      type: 'info' as const,
      content: String(id),
      duration: 3000,
      closable: true,
    }))
    expect(
      upsertMessageList(items, {
        id: 6,
        type: 'error',
        content: '6',
        duration: 3000,
        closable: true,
      }).map((item) => item.id),
    ).toEqual([2, 3, 4, 5, 6])
  })
})

describe('removeMessageById', () => {
  it('按 id 移除', () => {
    const items = [
      {
        id: 1,
        type: 'info' as const,
        content: 'a',
        duration: 3000,
        closable: true,
      },
      {
        id: 2,
        type: 'error' as const,
        content: 'b',
        duration: 3000,
        closable: true,
      },
    ]
    expect(removeMessageById(items, 1)).toEqual([items[1]])
  })
})
