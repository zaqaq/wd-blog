type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <p className="text-base text-[#666]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-[3px] bg-[#09f] px-4 py-2 text-sm text-white hover:bg-[#008ae6]"
        >
          重试
        </button>
      ) : null}
    </div>
  )
}
