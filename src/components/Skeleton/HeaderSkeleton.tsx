import { Bone } from '@/components/Skeleton/Bone.tsx'

export function HeaderMenuSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul
      className="ml-[25px] flex shrink-0 items-center"
      aria-busy
      aria-label="导航加载中"
    >
      <li className="px-2.5 py-[15px]">
        <Bone className="h-4 w-10" />
      </li>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="px-2.5 py-[15px]">
          <Bone className="h-4 w-12" />
        </li>
      ))}
    </ul>
  )
}

export function HeaderUserSkeleton() {
  return (
    <div
      className="ml-[30px] flex w-[160px] shrink-0 items-center gap-2.5"
      aria-busy
      aria-label="用户信息加载中"
    >
      <Bone className="h-[17px] w-[88px]" />
      <Bone className="h-[30px] w-[30px] rounded-full" />
    </div>
  )
}
