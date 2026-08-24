import { Link, Navigate, useLocation } from 'react-router-dom'
import { paths } from '@/lib/paths.ts'

export function LegacyOrNotFound() {
  const { pathname, search } = useLocation()
  const pageMatch = pathname.match(/^\/page(\d+)$/)
  if (pageMatch) {
    return <Navigate to={`${paths.page(Number(pageMatch[1]))}${search}`} replace />
  }

  const articleMatch = pathname.match(/^\/article-detail(\d+)$/)
  if (articleMatch) {
    return <Navigate to={`${paths.article(articleMatch[1])}${search}`} replace />
  }

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-lg text-[#333]">页面不存在</p>
      <p className="mt-2 text-sm text-[#999]">{pathname}</p>
      <Link to={paths.home} className="mt-4 text-[#09f] hover:underline">
        返回首页
      </Link>
    </div>
  )
}
