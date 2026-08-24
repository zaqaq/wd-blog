import type { ReactNode } from 'react'

type SideWidgetProps = {
  icon: string
  iconClass: string
  title: string
  children: ReactNode
}

export function SideWidget({
  icon,
  iconClass,
  title,
  children,
}: SideWidgetProps) {
  return (
    <div className="mb-[18px] rounded-[5px] bg-white shadow-[0_1px_2px_#c5c5c5]">
      <h3 className="relative cursor-default border-b border-[#f1f1ef] pl-[15px] text-base leading-[40px] after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-[108px] after:bg-[#09f] after:content-['']">
        <i className={`iconfont ${icon} mr-[5px] ${iconClass}`} />
        {title}
      </h3>
      {children}
    </div>
  )
}
