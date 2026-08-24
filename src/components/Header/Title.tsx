import { Link } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { paths } from '@/lib/paths.ts'

export function HeaderTitle() {
  return (
    <Link to={paths.home} className="flex items-center">
      <img src={logo} alt="" className="h-[35px]" />
    </Link>
  )
}
