import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'

export function useWorkflowDetail(name: string) {
  const { getToken, userId, isSignedIn } = useAuth()
  
  return useQuery({
    queryKey: ['workflow', userId, name],
    queryFn: async () => {
      const token = isSignedIn ? await getToken() : null
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE_URL}/api/workflows/${name}`, { headers })
      if (!response.ok) throw new Error('Failed to fetch workflow detail')
      return response.json()
    },
    enabled: !!name,
    staleTime: 1000 * 60,
  })
}


