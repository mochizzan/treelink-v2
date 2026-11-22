import { useRef } from 'react'
import { useParallax } from '../hooks/useParallax'

export function Backdrop() {
  const lensRef = useRef<HTMLDivElement>(null)
  useParallax(lensRef)

  return (
    <div className="backdrop fixed inset-0 overflow-hidden bg-background pointer-events-none z-0" aria-hidden="true">
      <div className="backdrop__pattern absolute inset-[-64px] bg-background bg-[image:var(--dot-pattern)] bg-size-[8px_8px] opacity-[0.3] translate-x-[calc(var(--parallax-x,0px)*3)] translate-y-[calc(var(--parallax-y,0px)*3)] will-change-[transform]" />
      <div className="backdrop__lens" ref={lensRef} />
    </div>
  )
}
