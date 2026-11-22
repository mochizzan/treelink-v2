import type { Support } from '../data/site'
import { CoffeeMug } from './CoffeeMug'

type SupportLinkProps = {
  support: Support
}

export function SupportLink({ support }: SupportLinkProps) {
  return (
    <div className="flex justify-center mt-9">
      <a
        className="pill inline-flex min-h-14 items-center justify-center gap-2.5 px-[30px] border-2 border-solid border-foreground rounded-[999px] bg-cta text-cta-foreground text-lg font-[800] leading-none"
        href={support.href}
        target="_blank"
        rel="noreferrer"
        aria-label={support.ariaLabel}
      >
        <span>{support.label}</span>
        <span className="pill__mark" aria-hidden="true">
          <CoffeeMug className="text-[22px]" />
          <span className="pill__sparkle pill__sparkle--1" />
          <span className="pill__sparkle pill__sparkle--2" />
        </span>
        <span className="pill__sheen" />
      </a>
    </div>
  )
}
