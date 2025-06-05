import { HydratedRouter } from 'react-router/dom';
import {startTransition, StrictMode} from 'react'
import {hydrateRoot} from 'react-dom/client'

import reportWebVitals from './reportWebVitals'
import {sendToVercelAnalytics} from './vitals'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})

reportWebVitals(sendToVercelAnalytics)
