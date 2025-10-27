import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../config'

interface Stats {
  workflows: {
    total: number
    active: number
  }
  executions: {
    total: number
    success: number
    failed: number
  }
  performance: {
    avg_duration_ms: number
    success_rate: number
  }
}

async function fetchStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE_URL}/api/stats`)
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })
}

