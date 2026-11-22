import { useEffect, useRef, useState } from 'react'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../hooks/useToast'
import { Icon } from './Icon'
import { Toast } from './Toast'

const THEME_KEY = 'lt2-theme'
const LIGHT_META = '#DFDBE5'
const DARK_META = '#171220'

export function Fab() {
  const [open, setOpen] = useState(false)
  const { copied, copy } = useClipboard()
  const { message, notify } = useToast()
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstItemRef = useRef<HTMLButtonElement>(null)
  const themeLabelRef = useRef<HTMLSpanElement>(null)

  // The <html> class is the single source of truth for the theme. Keep the
  // label in sync without mirroring it into React state.
  function syncThemeLabel() {
    const dark = document.documentElement.classList.contains('dark')
    if (themeLabelRef.current) {
      themeLabelRef.current.textContent = dark ? 'Tema terang' : 'Tema gelap'
      themeLabelRef.current.parentElement?.setAttribute(
        'aria-label',
        dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap',
      )
    }
  }

  useEffect(() => {
    if (!open) return

    syncThemeLabel()
    firstItemRef.current?.focus()

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      setOpen(false)
      toggleRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleTheme() {
    const root = document.documentElement
    const dark = root.classList.toggle('dark')
    root.classList.toggle('light', !dark)

    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      // Storage can be blocked in private browsing; the class change still applies.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? DARK_META : LIGHT_META)
    syncThemeLabel()
  }

  async function handleCopy() {
    const ok = await copy(window.location.href)
    notify(ok ? 'Tautan profil disalin.' : 'Gagal menyalin tautan.')
  }

  return (
    <div
      ref={rootRef}
      className="fab fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3 sm:bottom-14 sm:right-14 lg:bottom-20 lg:right-20"
    >
      {open && (
        <div className="fab__menu" id="fab-menu" role="group" aria-label="Aksi cepat">
          <button
            ref={firstItemRef}
            type="button"
            className="fab__item inline-flex min-h-11 items-center gap-2.5 px-4 border-2 border-solid border-foreground rounded-full bg-surface text-foreground text-sm font-[800] leading-none"
            onClick={handleTheme}
          >
            <Icon name="sun" className="fab__icon--sun text-lg" />
            <Icon name="moon" className="fab__icon--moon text-lg" />
            <span ref={themeLabelRef}>Tema gelap</span>
          </button>
          <button
            type="button"
            className="fab__item inline-flex min-h-11 items-center gap-2.5 px-4 border-2 border-solid border-foreground rounded-full bg-surface text-foreground text-sm font-[800] leading-none"
            onClick={handleCopy}
          >
            <Icon name={copied ? 'check' : 'copy'} className="text-lg" />
            <span>{copied ? 'Tautan disalin' : 'Salin tautan'}</span>
          </button>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="fab__toggle grid w-[52px] h-[52px] place-items-center border-2 border-solid border-foreground rounded-full bg-accent text-accent-foreground"
        aria-label={open ? 'Tutup menu cepat' : 'Buka menu cepat'}
        aria-expanded={open}
        aria-controls={open ? 'fab-menu' : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="fab__plus" aria-hidden="true" />
      </button>

      <Toast message={message} />
    </div>
  )
}
