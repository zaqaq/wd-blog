type BoneProps = {
  className?: string
}

export function Bone({ className = '' }: BoneProps) {
  return (
    <span
      className={`block animate-pulse rounded bg-[#e8edf3] ${className}`}
      aria-hidden
    />
  )
}
