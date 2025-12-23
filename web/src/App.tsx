import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SignedIn } from '@clerk/clerk-react'
import { AppLayout } from './layouts/AppLayout'
import { MarketingLanding } from './pages/MarketingLanding'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Workflows } from './pages/Workflows'
import { WorkflowDetail } from './pages/WorkflowDetail'
import { Sessions } from './pages/Sessions'
import { SessionReplay } from './pages/SessionReplay'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Deploy } from './pages/Deploy'
import { Chat } from './pages/Chat'
import { usePageTracking } from './hooks/useAnalytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function PageTracker() {
  usePageTracking()
  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageTracker />
        <Routes>
          {/* Marketing landing page */}
          <Route path="/" element={<MarketingLanding />} />
          
          {/* App landing page (sign in/up) */}
          <Route path="/app" element={<Landing />} />

          {/*  */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/workflows"
            element={
              <SignedIn>
                <AppLayout>
                  <Workflows />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/workflows/:workflowName"
            element={
              <SignedIn>
                <AppLayout>
                  <WorkflowDetail />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/sessions"
            element={
              <SignedIn>
                <AppLayout>
                  <Sessions />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/sessions/:sessionId"
            element={
              <SignedIn>
                <AppLayout>
                  <SessionReplay />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/analytics"
            element={
              <SignedIn>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/settings"
            element={
              <SignedIn>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/deploy"
            element={
              <SignedIn>
                <AppLayout>
                  <Deploy />
                </AppLayout>
              </SignedIn>
            }
          />
          <Route
            path="/chat"
            element={
              <SignedIn>
                <AppLayout>
                  <Chat />
                </AppLayout>
              </SignedIn>
            }
          />

          {/* Fallback - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
