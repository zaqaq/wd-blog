import { type ButtonHTMLAttributes } from 'react'

type LoginHoverButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string
}

export function LoginHoverButton({
  text,
  className = '',
  ...props
}: LoginHoverButtonProps) {
  return (
    <button
      className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#e5e5e5] bg-white px-6 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-disabled:translate-x-0 group-disabled:opacity-100">
        {text}
      </span>
      <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full bg-[#171717] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-disabled:opacity-0">
        <span>{text}</span>
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  )
}
