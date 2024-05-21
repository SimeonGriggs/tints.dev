import {RemixBrowser} from '@remix-run/react'
import {startTransition, StrictMode} from 'react'
import {hydrateRoot} from 'react-dom/client'

import reportWebVitals from './reportWebVitals'
import {sendToVercelAnalytics} from './vitals'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  )
})

reportWebVitals(sendToVercelAnalytics)
