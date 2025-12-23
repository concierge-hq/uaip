import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'

export function useStats() {
  const { getToken, userId, isSignedIn } = useAuth()
  
  return useQuery({
    queryKey: ['stats', userId],
    queryFn: async () => {
      const token = isSignedIn ? await getToken() : null
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE_URL}/api/stats?user_id=${userId}`, { headers })
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
    enabled: !!userId, 
    refetchInterval: 30000,
    staleTime: 20000,
  })
}


