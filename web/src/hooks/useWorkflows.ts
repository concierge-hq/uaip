import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE_URL } from '../config'

export interface Workflow {
  name: string 
  display_name: string
  description: string
  worker_url: string
}

export function useWorkflows() {
  const { getToken, userId, isSignedIn } = useAuth()
  
  return useQuery<Workflow[]>({
    queryKey: ['workflows', userId],
    queryFn: async () => {
      const token = isSignedIn ? await getToken() : null
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE_URL}/api/workflows`, { headers })
      if (!response.ok) throw new Error('Failed to fetch workflows')
      const data = await response.json()
      return data.workflows || []
    },
    staleTime: 1000 * 60 * 5,
  })
}


