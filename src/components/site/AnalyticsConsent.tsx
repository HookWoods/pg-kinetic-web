import { useEffect, useState } from 'react'
import {
  analyticsConsentResetEvent,
  getAnalyticsConsent,
  isAnalyticsConfigured,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from '@/lib/analytics'

export function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() =>
    isAnalyticsConfigured() ? getAnalyticsConsent() : 'denied',
  )

  useEffect(() => {
    const reopen = () => setConsent(null)
    window.addEventListener(analyticsConsentResetEvent, reopen)
    return () => window.removeEventListener(analyticsConsentResetEvent, reopen)
  }, [])

  if (consent !== null) {
    return null
  }

  const choose = (value: AnalyticsConsent) => {
    setAnalyticsConsent(value)
    setConsent(value)
  }

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl border border-white/15 bg-[#090c13]/95 p-4 shadow-2xl backdrop-blur-md sm:bottom-6"
      aria-label="Analytics preferences"
    >
      <p className="text-sm font-semibold text-zinc-100">Analytics preferences</p>
      <p className="mt-1.5 text-sm leading-6 text-zinc-300">
        We use Google Analytics to understand aggregate site use. Accept enables Google analytics cookies; reject keeps analytics off.
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="border border-white/20 px-3.5 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-white/40"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="bg-pg px-3.5 py-2 text-sm font-semibold text-[#05101c] transition-colors hover:bg-pg-bright"
        >
          Accept analytics
        </button>
      </div>
    </aside>
  )
}
