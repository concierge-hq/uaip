import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'

export function useSessions(page = 1, limit = 50) {
  const { getToken, userId } = useAuth()
  
  return useQuery({
    queryKey: ['sessions', userId, page, limit],
    queryFn: async () => {
      const token = await getToken()
      const response = await fetch(
        `${API_BASE_URL}/api/sessions?page=${page}&limit=${limit}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        }
      )
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch sessions (${response.status}): ${errorText}`)
      }
      return response.json()
    },
    staleTime: 1000 * 30,
  })
}


