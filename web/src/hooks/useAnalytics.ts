import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function pushToDataLayer(event: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export function trackPageView(path: string, title?: string) {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
  })
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  pushToDataLayer({
    event: action,
    event_category: category,
    event_label: label,
    value: value,
  })
}

export const analytics = {
  signInClicked: () => trackEvent('sign_in_click', 'auth', 'sign_in_button'),
  signUpClicked: () => trackEvent('sign_up_click', 'auth', 'sign_up_button'),
  signInCompleted: () => trackEvent('sign_in_complete', 'auth', 'sign_in'),
  signUpCompleted: () => trackEvent('sign_up_complete', 'auth', 'sign_up'),
  signOut: () => trackEvent('sign_out', 'auth', 'sign_out'),

  waitlistOpened: () => trackEvent('waitlist_open', 'waitlist', 'modal_opened'),
  waitlistSubmitted: (email: string) => trackEvent('waitlist_submit', 'waitlist', email),
  waitlistClosed: () => trackEvent('waitlist_close', 'waitlist', 'modal_closed'),

  ctaClicked: (ctaName: string) => trackEvent('cta_click', 'cta', ctaName),
  externalLinkClicked: (url: string) => trackEvent('external_link_click', 'external_link', url),
  
  featureUsed: (featureName: string) => trackEvent('feature_use', 'feature', featureName),
  workflowViewed: (workflowName: string) => trackEvent('workflow_view', 'workflow', workflowName),
  sessionViewed: (sessionId: string) => trackEvent('session_view', 'session', sessionId),
  
  demoBooked: () => trackEvent('demo_book_click', 'engagement', 'book_demo'),
  pageScrolled: (percentage: number) => trackEvent('page_scroll', 'engagement', `${percentage}%`, percentage),
}

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])
}

export function useAnalytics() {
  usePageTracking()
  return analytics
}
