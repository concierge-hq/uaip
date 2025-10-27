import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../config'

interface WorkflowSummary {
  name: string
  description: string
  stages: string[]
  initial_stage: string
}

interface WorkflowsResponse {
  workflows: WorkflowSummary[]
}

async function fetchWorkflows(): Promise<WorkflowSummary[]> {
  const response = await fetch(`${API_BASE_URL}/api/workflows`)
  if (!response.ok) throw new Error('Failed to fetch workflows')
  const data: WorkflowsResponse = await response.json()
  return data.workflows
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
  })
}

