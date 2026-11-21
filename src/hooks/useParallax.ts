import { useEffect } from 'react'
import type { RefObject } from 'react'

const POINTER_RANGE = 18
const SCROLL_RATE = 0.05
const LIMIT = 16
const LENS_EASE = 0.18

function clamp(value: number) {
  return Math.max(-LIMIT, Math.min(LIMIT, value))
}

/**
 * Moves the decorative background and frame on two different planes.
 * Pointer movement drives the effect on desktop; scroll drives it on touch.
 * The same pointer position feeds a dot lens, eased a few frames behind
 * the cursor; the dots fade toward the rim. Everything stays still for
 * reduced-motion visitors.
 */
export function useParallax(lens?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lensElement = lens?.current ?? null

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let scrollY = window.scrollY
    let lensX = -400
    let lensY = -400
    let targetX = -400
    let targetY = -400
    let lensActive = false

    const setLensActive = (active: boolean) => {
      if (lensActive === active) return
      lensActive = active
      lensElement?.classList.toggle('is-active', active)
    }

    function render() {
      frame = 0

      if (media.matches) {
        root.style.setProperty('--parallax-x', '0px')
        root.style.setProperty('--parallax-y', '0px')
        setLensActive(false)
        return
      }

      const x = clamp(pointerX * POINTER_RANGE)
      const y = clamp(pointerY * POINTER_RANGE - scrollY * SCROLL_RATE)
      root.style.setProperty('--parallax-x', `${x.toFixed(2)}px`)
      root.style.setProperty('--parallax-y', `${y.toFixed(2)}px`)

      if (!lensActive) return

      const dx = targetX - lensX
      const dy = targetY - lensY
      lensX += dx * LENS_EASE
      lensY += dy * LENS_EASE

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        lensX = targetX
        lensY = targetY
      }

      root.style.setProperty('--lens-x', `${lensX.toFixed(1)}px`)
      root.style.setProperty('--lens-y', `${lensY.toFixed(1)}px`)

      if (lensX !== targetX || lensY !== targetY) {
        schedule()
      }
    }

    function schedule() {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (media.matches || event.pointerType !== 'mouse') return

      pointerX = event.clientX / window.innerWidth - 0.5
      pointerY = event.clientY / window.innerHeight - 0.5
      targetX = event.clientX
      targetY = event.clientY

      // Entering the window snaps the loupe to the cursor; moving inside it
      // eases so the lens trails a few frames behind.
      if (!lensActive) {
        lensX = targetX
        lensY = targetY
        setLensActive(true)
      }

      schedule()
    }

    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.relatedTarget) return
      setLensActive(false)
    }

    const onScroll = () => {
      scrollY = window.scrollY
      schedule()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    media.addEventListener('change', schedule)
    render()

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('scroll', onScroll)
      media.removeEventListener('change', schedule)
      lensElement?.classList.remove('is-active')
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
      root.style.removeProperty('--parallax-x')
      root.style.removeProperty('--parallax-y')
      root.style.removeProperty('--lens-x')
      root.style.removeProperty('--lens-y')
    }
  }, [lens])
}
