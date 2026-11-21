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
            className="dialog__close"
            onClick={() => onClose('dismiss')}
            aria-label="Tutup pilihan tautan"
          >
            <Icon name="close" />
          </button>

          <div className="action">
            <span className="action__icon" aria-hidden="true">
              <Icon name={action.id} />
            </span>
            <h2 id="action-title" className="action__title">
              {action.name}
            </h2>
            <p className="action__handle">{action.handle}</p>
            <p id="action-description" className="action__description">
              {action.description}
            </p>

            <div className="action__choices">
              <button
                type="button"
                className="action__choice action__copy"
                onClick={handleCopy}
              >
                <Icon name={copied ? 'check' : 'link'} className="action__choice-icon" />
                <span>{copied ? 'Tautan tersalin' : 'Salin tautan'}</span>
              </button>

              <a
                className="action__choice action__open"
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
                <Icon name="arrow-up-right" className="action__choice-icon" />
              </a>
            </div>
          </div>
        </>
      )}
    </Dialog>
  )
}
