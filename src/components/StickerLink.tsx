import type { SocialLink } from '../data/site'
import { Icon } from './Icon'

type StickerLinkProps = {
  link: SocialLink
  onAction: (link: SocialLink) => void
}

export function StickerLink({ link, onAction }: StickerLinkProps) {
  return (
    <a
      className="sticker"
      href={link.href}
      aria-label={link.ariaLabel}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault()
        onAction(link)
      }}
    >
      <Icon name={link.id} className="sticker__icon" />
      <span className="sticker__label">{link.label}</span>
    </a>
  )
}
