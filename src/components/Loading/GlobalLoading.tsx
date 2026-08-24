export function GlobalLoading() {
  return (
    <div className="flex min-h-[380px] items-center justify-center">
      <div className="relative h-[120px] w-[120px]">
        <span className="absolute inset-0 animate-ping rounded-full border-4 border-[#e90c59] opacity-60" />
        <span className="absolute inset-3 animate-ping rounded-full border-4 border-[#46dff0] opacity-60 [animation-delay:500ms]" />
      </div>
    </div>
  )
}
