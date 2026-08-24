import { type ChangeEvent, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/lib/paths.ts'

export function HeaderSearch() {
  const navigate = useNavigate()

  const runSearch = (raw: string) => {
    const value = raw.trim()
    if (!value) {
      navigate(paths.home)
      return
    }
    navigate(paths.search(value))
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = new FormData(event.currentTarget).get('s')
    runSearch(typeof keyword === 'string' ? keyword : '')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === '') {
      runSearch('')
    }
  }

  return (
    <form
      className="flex flex-1 justify-center"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="relative ml-5 h-[37px] w-[300px]">
        <input
          name="s"
          type="search"
          placeholder="请输入要搜索的内容"
          autoComplete="off"
          onChange={handleChange}
          className="peer h-full w-full rounded-full border border-[#ebebeb] bg-[#f6f6f6] py-[5px] pr-[50px] pl-4 text-[#121212] outline-none focus:border-[#8590a6] focus:bg-white"
        />
        <button
          type="submit"
          className="iconfont icon-sousuo absolute top-px right-px z-[1] h-[35px] cursor-pointer rounded-r-2xl border-0 bg-transparent px-2.5 text-[20px] leading-[35px] text-inherit transition peer-focus:bg-[#09f] peer-focus:text-white"
          aria-label="搜索"
        />
      </div>
    </form>
  )
}
