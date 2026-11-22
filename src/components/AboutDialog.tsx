import type { Profile, SocialLink } from '../data/site'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../hooks/useToast'
import { Dialog } from './Dialog'
import type { DialogCloseReason } from './Dialog'
import { Icon } from './Icon'
import { PortraitAvatar } from './PortraitAvatar'
import { Toast } from './Toast'

type AboutDialogProps = {
  open: boolean
  onClose: (reason: DialogCloseReason) => void
  onAction: (action: SocialLink) => void
  profile: Profile
  links: SocialLink[]
  behind?: boolean
}

export function AboutDialog({
  open,
  onClose,
  onAction,
  profile,
  links,
  behind = false,
}: AboutDialogProps) {
  const { copied, copy } = useClipboard()
  const { message, notify } = useToast()

  async function handleCopy() {
    const ok = await copy(window.location.href)
    notify(ok ? 'Tautan profil disalin.' : 'Gagal menyalin tautan.')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="about-title"
      describedBy="about-bio"
      behind={behind}
      status={<Toast message={message} />}
    >
      <button
        type="button"
        className="absolute top-4 right-4 grid w-9 h-9 place-items-center border-2 border-solid border-foreground rounded-full bg-surface-muted text-foreground text-base [transition:background-color_0.2s_ease,transform_0.2s_ease] hover:bg-accent active:scale-[0.92]"
        onClick={() => onClose('dismiss')}
        aria-label="Tutup kartu profil"
      >
        <Icon name="close" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 p-[3px] border-2 border-solid border-foreground rounded-full bg-surface">
          <PortraitAvatar />
        </div>
        <h2 id="about-title" className="mt-3.5 text-2xl font-[900] leading-[1.1] tracking-[-0.03em]">
          {profile.name}
        </h2>
        <p className="mt-1 text-foreground-muted text-[15px] font-bold leading-[1.35]">{profile.role}</p>
        <p id="about-bio" className="max-w-[40ch] mt-4 text-base text-foreground-muted leading-[1.55]">
          {profile.about}
        </p>

        <div className="flex w-full flex-col gap-0.5 mt-5 text-left">
          {links.map((link) => (
            <a
              key={link.id}
              className="flex min-h-12 items-center gap-3 px-2.5 py-2 rounded-[14px] [transition:background-color_0.2s_ease] hover:bg-surface-muted"
              href={link.href}
              aria-label={link.ariaLabel}
              aria-haspopup="dialog"
              onClick={(event) => {
                event.preventDefault()
                onAction(link)
              }}
            >
              <Icon name={link.id} className="flex-none text-xl" />
              <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
                <span className="text-[15px] font-[800] leading-[1.2]">{link.name}</span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground-muted leading-[1.2]">{link.handle}</span>
              </span>
              <Icon name="arrow-up-right" className="flex-none text-base text-foreground-muted" />
            </a>
          ))}
        </div>

        <button type="button" className="inline-flex w-full min-h-12 items-center justify-center gap-2 mt-5 border-2 border-solid border-foreground rounded-[999px] bg-accent text-accent-foreground text-base font-[800] [transition:background-color_0.2s_ease,transform_0.2s_ease] hover:bg-accent-hover active:scale-[0.98]" onClick={handleCopy}>
          <Icon name={copied ? 'check' : 'link'} className="text-lg" />
          <span>{copied ? 'Tautan disalin' : 'Salin tautan profil'}</span>
        </button>
      </div>
    </Dialog>
  )
}
