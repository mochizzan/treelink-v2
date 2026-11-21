type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      className={message ? 'toast is-visible' : 'toast'}
      role="status"
      aria-live="polite"
    >
      <span className="toast__dot" aria-hidden="true" />
      <span>{message ?? ''}</span>
    </div>
  )
}
