import { useCallback, useEffect, useRef, useState } from 'react'

const RESET_MS = 2400

export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setCopied(false)
    clearTimer()
  }, [clearTimer])

  const copy = useCallback(
    async (text: string) => {
      let ok = false

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
          ok = true
        }
      } catch {
        ok = false
      }

      if (!ok) {
        const field = document.createElement('textarea')
        field.value = text
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.top = '-9999px'
        field.style.opacity = '0'
        document.body.appendChild(field)

        try {
          field.select()
          ok = document.execCommand('copy')
        } catch {
          ok = false
        } finally {
          document.body.removeChild(field)
        }
      }

      if (!ok) {
        setCopied(false)
        return false
      }

      setCopied(true)
      clearTimer()
      timer.current = window.setTimeout(() => {
        timer.current = null
        setCopied(false)
      }, RESET_MS)
      return true
    },
    [clearTimer],
  )

  useEffect(() => clearTimer, [clearTimer])

  return { copied, copy, reset }
}
