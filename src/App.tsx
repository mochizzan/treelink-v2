import { useEffect, useRef, useState } from 'react'
import './App.css'
import { AboutDialog } from './components/AboutDialog'
import { ActionDialog } from './components/ActionDialog'
import { Backdrop } from './components/Backdrop'
import { Fab } from './components/Fab'
import { FrameRails } from './components/FrameRails'
import { ProfileHero } from './components/ProfileHero'
import { SiteFooter } from './components/SiteFooter'
import { SocialLinks } from './components/SocialLinks'
import { SupportLink } from './components/SupportLink'
import type { DialogCloseReason } from './components/Dialog'
import type { SocialLink } from './data/site'
import { profile, siteYear, socials, support } from './data/site'

// One Escape press fires `cancel` on every open dialog, including the profile
// behind the action dialog. Ignore a profile cancel that belongs to the same
// key press.
const ESCAPE_GUARD_MS = 250

function App() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<SocialLink | null>(null)
  const [actionOpen, setActionOpen] = useState(false)
  const actionCancelledAt = useRef(-Infinity)

  function openAction(action: SocialLink) {
    setActiveAction(action)
    setActionOpen(true)
  }

  function closeAction(reason: DialogCloseReason) {
    if (reason === 'cancel') {
      actionCancelledAt.current = performance.now()
    }
    setActionOpen(false)
  }

  function clearAction() {
    setActiveAction(null)
  }

  function closeAbout(reason: DialogCloseReason) {
    if (
      reason === 'cancel' &&
      performance.now() - actionCancelledAt.current < ESCAPE_GUARD_MS
    ) {
      return
    }
    setAboutOpen(false)
  }

  // Escape is handled here, before the browser asks both stacked dialogs to
  // close. Only the top one closes, and the profile survives the first press.
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return

      if (actionOpen) {
        event.preventDefault()
        actionCancelledAt.current = performance.now()
        setActionOpen(false)
      } else if (aboutOpen) {
        event.preventDefault()
        setAboutOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape, true)
    return () => window.removeEventListener('keydown', handleEscape, true)
  }, [actionOpen, aboutOpen])

  return (
    <>
      <Backdrop />
      <div className="relative z-[1] flex flex-col min-h-[100svh] p-9 sm:p-[60px] lg:p-20">
        <FrameRails />
        <main className="flex flex-1 flex-col">
          <div className="w-full max-w-[640px] mx-auto text-center">
            <ProfileHero profile={profile} onAbout={() => setAboutOpen(true)} />
            <SocialLinks links={socials} onAction={openAction} />
            <SupportLink support={support} />
          </div>
        </main>
        <SiteFooter name={profile.name} year={siteYear} />
      </div>
      <Fab />
      <AboutDialog
        open={aboutOpen}
        onClose={closeAbout}
        onAction={openAction}
        profile={profile}
        links={socials}
        behind={aboutOpen && actionOpen}
      />
      <ActionDialog
        action={activeAction}
        open={actionOpen}
        onClose={closeAction}
        onExited={clearAction}
      />
    </>
  )
}

export default App
