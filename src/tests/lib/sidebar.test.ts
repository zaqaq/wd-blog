import { describe, expect, it } from 'vitest'
import {
  SIDEBAR_STICKY_OFFSET_PX,
  pinnedSidebarMaxHeight,
  resolvePinnedSidebarScrollTop,
  shouldPinSidebar,
  splitSidebarWheel,
  normalizeWheelDeltaY,
} from '@/lib/sidebar.ts'

describe('shouldPinSidebar', () => {
  it('简介还在视口内时不固定', () => {
    expect(shouldPinSidebar(0, 180)).toBe(false)
    expect(shouldPinSidebar(179, 180)).toBe(false)
  })

  it('页面滚过简介后从最近更新固定', () => {
    expect(shouldPinSidebar(180, 180)).toBe(true)
    expect(shouldPinSidebar(400, 180)).toBe(true)
  })

  it('没有简介时不固定', () => {
    expect(shouldPinSidebar(120, 0)).toBe(false)
  })
})

describe('pinnedSidebarMaxHeight', () => {
  it('按吸顶偏移计算可视高度', () => {
    expect(pinnedSidebarMaxHeight(SIDEBAR_STICKY_OFFSET_PX)).toBe(
      'calc(100svh - 74px)',
    )
  })
})

describe('splitSidebarWheel', () => {
  it('中间滚动只移动侧栏', () => {
    expect(splitSidebarWheel(20, 40, 200, 80)).toEqual({ sidebar: 20, page: 0 })
    expect(splitSidebarWheel(-20, 40, 200, 80)).toEqual({ sidebar: -20, page: 0 })
  })

  it('到顶或到底后余量交给页面', () => {
    expect(splitSidebarWheel(-30, 0, 200, 80)).toEqual({ sidebar: 0, page: -30 })
    expect(splitSidebarWheel(30, 120, 200, 80)).toEqual({ sidebar: 0, page: 30 })
  })

  it('一次滚动跨过边界时拆给侧栏和页面', () => {
    expect(splitSidebarWheel(-30, 10, 200, 80)).toEqual({
      sidebar: -10,
      page: -20,
    })
    expect(splitSidebarWheel(40, 90, 200, 80)).toEqual({ sidebar: 30, page: 10 })
  })

  it('侧栏装得下时全部交给页面', () => {
    expect(splitSidebarWheel(24, 0, 80, 80)).toEqual({ sidebar: 0, page: 24 })
  })
})

describe('resolvePinnedSidebarScrollTop', () => {
  it('首次吸顶对齐到最近更新', () => {
    expect(resolvePinnedSidebarScrollTop(180, 0, false)).toBe(180)
  })

  it('用户已在侧栏里滚过则保持当前位置，避免回跳', () => {
    expect(resolvePinnedSidebarScrollTop(180, 0, true)).toBe(0)
    expect(resolvePinnedSidebarScrollTop(180, 40, true)).toBe(40)
  })
})

describe('normalizeWheelDeltaY', () => {
  it('像素模式保持原值，行/页模式换算成像素', () => {
    expect(normalizeWheelDeltaY(40, 0)).toBe(40)
    expect(normalizeWheelDeltaY(3, 1, 16)).toBe(48)
    expect(normalizeWheelDeltaY(1, 2, 16, 800)).toBe(800)
  })
})
