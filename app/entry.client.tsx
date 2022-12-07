import {RemixBrowser} from '@remix-run/react'
import {hydrateRoot} from 'react-dom/client'

import reportWebVitals from './reportWebVitals'
import {sendToVercelAnalytics} from './vitals'

hydrateRoot(document, <RemixBrowser />)

reportWebVitals(sendToVercelAnalytics)
