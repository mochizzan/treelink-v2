type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  const base = 'fixed bottom-[28px] left-1/2 z-60 flex max-w-[calc(100vw-32px)] items-center gap-2.5 px-[18px] pt-3 pb-3 rounded-[999px] bg-foreground text-background text-[15px] font-[700] leading-[1.2] pointer-events-none shadow-[0_16px_36px_-16px_var(--overlay)] [transition:opacity_0.25s_ease,transform_0.25s_cubic-bezier(0.22,_1,_0.36,_1)]'

  return (
    <div
      className={`${base} ${message ? 'opacity-100 translate-x-[-50%] translate-y-0' : 'opacity-0 translate-x-[-50%] translate-y-[10px]'}`}
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 flex-none rounded-full bg-accent" aria-hidden="true" />
      <span>{message ?? ''}</span>
    </div>
  )
}
