import { useLocation, useNavigate } from 'react-router-dom'
import { updateRead } from '@/api/article.ts'
import { paths } from '@/lib/paths.ts'
import { saveScrollPosition } from '@/lib/scroll.ts'

export function useOpenArticle() {
  const navigate = useNavigate()
  const location = useLocation()

  const open = (id: number) => {
    saveScrollPosition(`${location.pathname}${location.search}`)
    navigate(paths.article(id), { preventScrollReset: true })
    void updateRead(id).catch(() => undefined)
  }

  return { open }
}
