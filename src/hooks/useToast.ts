import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_DURATION = 2600

export function useToast(duration = DEFAULT_DURATION) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    setMessage(null)
  }, [])

  const notify = useCallback(
    (text: string) => {
      setMessage(text)
      if (timer.current !== null) {
        window.clearTimeout(timer.current)
      }
      timer.current = window.setTimeout(() => {
        timer.current = null
        setMessage(null)
      }, duration)
    },
    [duration],
  )

  useEffect(() => clear, [clear])

  return { message, notify, clear }
}
