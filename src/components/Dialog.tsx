import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export type DialogCloseReason = 'cancel' | 'dismiss'

// The longest exit transition in App.css is the panel transform (0.2s).
// Keep the dialog in the top layer until it has finished.
const EXIT_MS = 240

type DialogProps = {
  open: boolean
  onClose: (reason: DialogCloseReason) => void
  onExited?: () => void
  labelledBy: string
  describedBy?: string
  behind?: boolean
  children: ReactNode
  status?: ReactNode
}

/**
 * A native modal dialog: the browser handles the focus trap, Escape and
 * returning focus to the avatar. The `status` slot lives outside the
 * scrollable panel so a toast stays in the top layer.
 */
export function Dialog({
  open,
  onClose,
  onExited,
  labelledBy,
  describedBy,
  behind = false,
  children,
  status,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const onExitedRef = useRef(onExited)

  useEffect(() => {
    onExitedRef.current = onExited
  }, [onExited])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.classList.remove('dialog--closing')
      if (!dialog.open) {
        dialog.showModal()
      }
      return
    }

    if (!dialog.open) {
      dialog.classList.remove('dialog--closing')
      return
    }

    // Closing immediately removes the dialog from the top layer, which skips
    // the exit in browsers that cannot transition `display`/`overlay`.
    // Animate while it is still open, then close it for real.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close()
      onExitedRef.current?.()
      return
    }

    dialog.classList.add('dialog--closing')
    const timer = window.setTimeout(() => {
      dialog.classList.remove('dialog--closing')
      dialog.close()
      onExitedRef.current?.()
    }, EXIT_MS)

    return () => {
      window.clearTimeout(timer)
      dialog.classList.remove('dialog--closing')
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={behind ? 'dialog dialog--behind' : 'dialog'}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      inert={behind || undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose('cancel')
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose('dismiss')
        }
      }}
    >
      <div className="dialog__panel">{children}</div>
      {status}
    </dialog>
  )
}
