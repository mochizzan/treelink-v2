import type { SocialLink } from '../data/site'
import { Icon } from './Icon'

type StickerLinkProps = {
  link: SocialLink
  onAction: (link: SocialLink) => void
}

export function StickerLink({ link, onAction }: StickerLinkProps) {
  return (
    <a
      className='sticker relative inline-flex w-24 h-24 flex-col items-center justify-center gap-1 border-2 border-solid border-foreground rounded-full bg-accent text-accent-foreground group [transition:transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease] before:content-[""] before:absolute before:inset-[-8px] before:border-2 before:border-solid before:border-foreground before:rounded-full before:opacity-[0.16] before:pointer-events-none hover:bg-accent-hover hover:translate-y-[-4px] hover:rotate-[-2deg] active:translate-y-[1px] active:scale-[0.96] focus-visible:outline-offset-[10px]'
      href={link.href}
      aria-label={link.ariaLabel}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault()
        onAction(link)
      }}
    >
      <Icon name={link.id} className="text-[26px] [transition:transform_0.35s_cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.1] group-hover:rotate-[-4deg]" />
      <span className="text-[15px] font-[800] leading-none tracking-[0.01em]">{link.label}</span>
    </a>
  )
}
