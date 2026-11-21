import { useRef } from 'react'
import { useParallax } from '../hooks/useParallax'

export function Backdrop() {
  const lensRef = useRef<HTMLDivElement>(null)
  useParallax(lensRef)

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__pattern" />
      <div className="backdrop__lens" ref={lensRef} />
    </div>
  )
}
