import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to .env.local')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'iconButton',
          showOptionalFields: false,
        },
        elements: {
          footer: { display: 'none' },
          footerAction: { display: 'none' },
          footerActionLink: { display: 'none' },
          footerPages: { display: 'none' },
          footerPagesLink: { display: 'none' },
          badge: { display: 'none' },
          logoBox: { display: 'none' },
          logoImage: { display: 'none' },
          dividerRow: { display: 'none' },
          poweredByClerk: { display: 'none' },
          internal: { display: 'none' },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
