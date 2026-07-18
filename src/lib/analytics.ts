export type AnalyticsConsent = 'granted' | 'denied'

const CONSENT_STORAGE_KEY = 'pg-kinetic-analytics-consent'
const CONSENT_RESET_EVENT = 'pg-kinetic-analytics-consent-reset'
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

function isValidMeasurementId(value: string | undefined): value is string {
  return Boolean(value && /^G-[A-Z0-9]+$/.test(value))
}

export function isAnalyticsConfigured() {
  return isValidMeasurementId(measurementId)
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  return value === 'granted' || value === 'denied' ? value : null
}

function loadGoogleAnalytics() {
  if (!measurementId || document.querySelector('script[data-pg-kinetic-ga]')) {
    return
  }

  window.dataLayer = window.dataLayer ?? []
  function gtag() {
    // Google Tag reads queued calls from the native arguments object.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments)
  }
  window.gtag = gtag
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.dataset.pgKineticGa = 'true'
  document.head.appendChild(script)
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, consent)

  if (consent === 'granted') {
    loadGoogleAnalytics()
  }
}

export function reopenAnalyticsConsent() {
  window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT))
}

export function initializeAnalytics() {
  if (isAnalyticsConfigured() && getAnalyticsConsent() === 'granted') {
    loadGoogleAnalytics()
  }
}

export const analyticsConsentResetEvent = CONSENT_RESET_EVENT
