import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../config'
import type { Workflow, WorkflowGraph } from '../types/workflow'

async function fetchWorkflow(name: string): Promise<{ workflow: Workflow; graph: WorkflowGraph }> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${name}`)
  if (!response.ok) throw new Error('Failed to fetch workflow')
  const data = await response.json()
  return {
    workflow: data,
    graph: data.graph
  }
}

export function useWorkflow(name: string) {
  return useQuery({
    queryKey: ['workflow', name],
    queryFn: () => fetchWorkflow(name),
    enabled: !!name,
  })
}

