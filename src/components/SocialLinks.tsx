import type { SocialLink } from '../data/site'
import { StickerLink } from './StickerLink'

type SocialLinksProps = {
  links: SocialLink[]
  onAction: (link: SocialLink) => void
}

export function SocialLinks({ links, onAction }: SocialLinksProps) {
  return (
    <nav className="flex flex-col items-center gap-[18px] mt-8" aria-label="Tautan sosial">
      {links.map((link) => (
        <StickerLink key={link.id} link={link} onAction={onAction} />
      ))}
    </nav>
  )
}
