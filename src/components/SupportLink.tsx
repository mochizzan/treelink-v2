import type { Support } from '../data/site'
import { CoffeeMug } from './CoffeeMug'

type SupportLinkProps = {
  support: Support
}

export function SupportLink({ support }: SupportLinkProps) {
  return (
    <div className="support">
      <a
        className="pill"
        href={support.href}
        target="_blank"
        rel="noreferrer"
        aria-label={support.ariaLabel}
      >
        <span>{support.label}</span>
        <CoffeeMug className="pill__icon" />
      </a>
    </div>
  )
}
