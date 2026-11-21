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
        className="dialog__close"
        onClick={() => onClose('dismiss')}
        aria-label="Tutup kartu profil"
      >
        <Icon name="close" />
      </button>

      <div className="about">
        <div className="about__avatar">
          <PortraitAvatar />
        </div>
        <h2 id="about-title" className="about__name">
          {profile.name}
        </h2>
        <p className="about__role">{profile.role}</p>
        <p id="about-bio" className="about__bio">
          {profile.about}
        </p>

        <div className="about__links">
          {links.map((link) => (
            <a
              key={link.id}
              className="about__link"
              href={link.href}
              aria-label={link.ariaLabel}
              aria-haspopup="dialog"
              onClick={(event) => {
                event.preventDefault()
                onAction(link)
              }}
            >
              <Icon name={link.id} className="about__link-icon" />
              <span className="about__link-text">
                <span className="about__link-label">{link.name}</span>
                <span className="about__link-handle">{link.handle}</span>
              </span>
              <Icon name="arrow-up-right" className="about__link-arrow" />
            </a>
          ))}
        </div>

        <button type="button" className="about__copy" onClick={handleCopy}>
          <Icon name={copied ? 'check' : 'link'} className="about__copy-icon" />
          <span>{copied ? 'Tautan disalin' : 'Salin tautan profil'}</span>
        </button>
      </div>
    </Dialog>
  )
}
