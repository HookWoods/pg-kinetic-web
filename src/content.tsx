import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ContentPage } from './pages/ContentPage'
import { initializeAnalytics } from './lib/analytics'

const page = document.body.dataset.page

if (page !== 'pgbouncer-alternative' && page !== 'postgresql-connection-pooling' && page !== 'postgresql-backpressure') {
  throw new Error(`Unknown content page: ${page ?? 'missing page id'}`)
}

initializeAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentPage page={page} />
  </StrictMode>,
)
