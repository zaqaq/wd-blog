type BlogIntroCardProps = {
  intro: string
  notice: string
}

export function BlogIntroCard({ intro, notice }: BlogIntroCardProps) {
  return (
    <div className="mb-[18px] rounded-[5px] bg-white px-[15px] pb-2.5 shadow-[0_1px_2px_#c5c5c5]">
      <h3 className="inline-block bg-[#09f] px-[15px] py-1 text-sm font-bold text-white">
        博主简介
      </h3>
      <div className="mt-2.5 leading-6">
        <p className="border-b border-dotted border-[#e6ecf2] pb-[5px] whitespace-pre-wrap text-[#666]">
          {intro || '暂无简介'}
        </p>
        <div className="pt-[5px]">
          <span>公告:</span>
          <p className="whitespace-pre-wrap text-[#666]">{notice || '暂无公告'}</p>
        </div>
      </div>
    </div>
  )
}
