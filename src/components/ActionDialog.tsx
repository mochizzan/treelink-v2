import { useEffect } from 'react'
import type { SocialLink } from '../data/site'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../hooks/useToast'
import { Dialog } from './Dialog'
import type { DialogCloseReason } from './Dialog'
import { Icon } from './Icon'
import { Toast } from './Toast'

type ActionDialogProps = {
  action: SocialLink | null
  open: boolean
  onClose: (reason: DialogCloseReason) => void
  onExited: () => void
}

export function ActionDialog({
  action,
  open,
  onClose,
  onExited,
}: ActionDialogProps) {
  const { copied, copy, reset } = useClipboard()
  const { message, notify, clear } = useToast()

  useEffect(() => {
    reset()
    clear()
  }, [action?.id, reset, clear])

  async function handleCopy() {
    if (!action) return
    const ok = await copy(action.href)
    notify(ok ? `Tautan ${action.name} disalin.` : 'Gagal menyalin tautan.')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onExited={onExited}
      labelledBy="action-title"
      describedBy="action-description"
      status={<Toast message={message} />}
    >
      {action && (
        <>
          <button
            type="button"
            className="dialog-close absolute top-4 right-4 grid w-9 h-9 place-items-center border-2 border-solid border-foreground rounded-full bg-surface-muted text-foreground text-base"
            onClick={() => onClose('dismiss')}
            aria-label="Tutup pilihan tautan"
          >
            <Icon name="close" />
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="grid w-16 h-16 place-items-center border-2 border-solid border-foreground rounded-[18px] bg-accent text-accent-foreground text-[30px] rotate-[-2deg]" aria-hidden="true">
              <Icon name={action.id} />
            </span>
            <h2 id="action-title" className="mt-[18px] text-[26px] font-[900] leading-[1.05] tracking-[-0.03em]">
              {action.name}
            </h2>
            <p className="mt-1.5 text-sm font-bold leading-[1.35] text-foreground-muted">{action.handle}</p>
            <p id="action-description" className="max-w-[32ch] mt-3.5 text-base leading-[1.5]">
              {action.description}
            </p>

            <div className="flex w-full flex-col gap-2.5 mt-6">
              <button
                type="button"
                className="dialog-action inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 border-2 border-solid border-foreground rounded-[999px] text-base font-[800] leading-none bg-surface text-foreground hover:bg-surface-muted"
                onClick={handleCopy}
              >
                <Icon name={copied ? 'check' : 'link'} className="flex-none text-lg" />
                <span>{copied ? 'Tautan tersalin' : 'Salin tautan'}</span>
              </button>

              <a
                className="dialog-cta inline-flex w-full min-h-[52px] items-center justify-center gap-2.5 border-2 border-solid border-foreground rounded-[999px] text-base font-[800] leading-none bg-cta text-cta-foreground hover:bg-cta-hover"
                href={action.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  // Let the browser follow the link before the dialog closes.
                  window.setTimeout(() => onClose('dismiss'), 0)
                }}
                aria-label={`Buka ${action.name} di tab baru`}
              >
                <span>Buka di tab baru</span>
                <Icon name="arrow-up-right" className="flex-none text-lg" />
              </a>
            </div>
          </div>
        </>
      )}
    </Dialog>
  )
}
