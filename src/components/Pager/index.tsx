import { useMemo } from 'react'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  parsePageSize,
} from '@/components/Pager/constants.ts'
import { Select } from '@/components/Select/index.tsx'

export { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, parsePageSize }

type PagerProps = {
  total: number
  pageNum: number
  onPageChange: (num: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  className?: string
}

export function Pager({
  total,
  pageNum,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  className = '',
}: PagerProps) {
  const totalCount = Math.ceil(total / pageSize)
  const countArray = useMemo(
    () => Array.from({ length: totalCount }, (_, index) => index + 1),
    [totalCount],
  )

  const { firstOmit, lastOmit, btList } = useMemo(() => {
    if (totalCount <= 9) {
      return { firstOmit: false, lastOmit: false, btList: countArray }
    }
    if (pageNum <= 5) {
      return {
        firstOmit: false,
        lastOmit: true,
        btList: countArray.slice(0, 8),
      }
    }
    if (pageNum > totalCount - 5) {
      return {
        firstOmit: true,
        lastOmit: false,
        btList: countArray.slice(countArray.length - 8),
      }
    }
    return {
      firstOmit: true,
      lastOmit: true,
      btList: [
        ...countArray.slice(pageNum - 4, pageNum - 1),
        pageNum,
        ...countArray.slice(pageNum, pageNum + 3),
      ],
    }
  }, [countArray, pageNum, totalCount])

  const goPage = (num: number) => {
    onPageChange(num)
    window.scrollTo(0, 0)
  }

  const pageBtnClass = (active: boolean, disabled = false) =>
    `mr-[3px] flex h-[39px] w-[39px] cursor-pointer items-center justify-center rounded-[3px] border last:mr-0 ${
      active
        ? 'border-[#09f] bg-[#09f] text-white hover:border-[#09f] hover:bg-[#09f] hover:text-white'
        : 'border-[#ced3d9] bg-white hover:border-[#0099ff] hover:text-[#0099ff]'
    } ${disabled ? 'cursor-not-allowed border-[#E6ECF2] text-[#999] hover:border-[#E6ECF2] hover:text-[#999]' : ''}`

  const showButtons = onPageSizeChange ? totalCount >= 1 : totalCount > 1
  if (!showButtons && !onPageSizeChange) {
    return null
  }

  return (
    <div
      className={`flex items-center bg-white px-5 ${className || 'justify-center py-5'}`}
    >
      {onPageSizeChange && (
        <label className="mr-4 flex items-center gap-2 text-sm text-[#667085]">
          每页
          <Select
            size="sm"
            value={pageSize}
            onChange={onPageSizeChange}
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              value: size,
              label: String(size),
            }))}
          />
          条
        </label>
      )}
      {showButtons && (
        <>
          <button
            type="button"
            className={pageBtnClass(false, pageNum === 1)}
            onClick={() => {
              if (pageNum !== 1) {
                goPage(pageNum - 1)
              }
            }}
          >
            <i className="iconfont iconarrow-left mt-px mr-0.5 text-[18px]" />
          </button>
          {firstOmit && (
            <button
              type="button"
              className={pageBtnClass(pageNum === 1)}
              onClick={() => goPage(1)}
            >
              1
            </button>
          )}
          {firstOmit && <strong className="mx-2.5 flex items-center">...</strong>}
          {btList.map((item) => (
            <button
              type="button"
              key={item}
              className={pageBtnClass(item === pageNum)}
              onClick={() => goPage(item)}
            >
              {item}
            </button>
          ))}
          {lastOmit && <strong className="mx-2.5 flex items-center">...</strong>}
          {lastOmit && (
            <button
              type="button"
              className={pageBtnClass(totalCount === pageNum)}
              onClick={() => goPage(totalCount)}
            >
              {totalCount}
            </button>
          )}
          <button
            type="button"
            className={`${pageBtnClass(false, pageNum === totalCount)} w-auto px-[15px]`}
            onClick={() => {
              if (pageNum !== totalCount) {
                goPage(pageNum + 1)
              }
            }}
          >
            下一页{' '}
            <i className="iconfont iconarrow-right mt-px mr-0.5 text-[18px]" />
          </button>
        </>
      )}
    </div>
  )
}
