import { useAuth } from '@clerk/clerk-react'

/**
 * Fetch with Clerk authentication.
 * Automatically includes JWT token in Authorization header.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { getToken } = useAuth()
  const token = await getToken()
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  })
}

