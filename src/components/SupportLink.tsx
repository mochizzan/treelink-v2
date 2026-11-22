import type { Support } from '../data/site'
import { CoffeeMug } from './CoffeeMug'

type SupportLinkProps = {
  support: Support
}

export function SupportLink({ support }: SupportLinkProps) {
  return (
    <div className="flex justify-center mt-9">
      <a
        className="pill inline-flex min-h-14 items-center justify-center gap-2.5 px-[30px] border-2 border-solid border-foreground rounded-[999px] bg-cta text-cta-foreground text-lg font-[800] leading-none [transition:transform_0.35s_cubic-bezier(0.34,1.56,0.64,1),background-color_0.2s_ease] hover:bg-cta-hover hover:translate-y-[-3px] active:translate-y-[1px] active:scale-[0.97]"
        href={support.href}
        target="_blank"
        rel="noreferrer"
        aria-label={support.ariaLabel}
      >
        <span>{support.label}</span>
        <CoffeeMug className="text-[22px]" />
      </a>
    </div>
  )
}
