import { useQuery } from '@tanstack/react-query'
import type { Workflow, WorkflowGraph } from '../types/workflow'
import { API_BASE_URL } from '../config'

async function fetchWorkflow(name: string): Promise<Workflow> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${name}`)
  if (!response.ok) throw new Error('Failed to fetch workflow')
  return response.json()
}

async function fetchWorkflowGraph(name: string): Promise<WorkflowGraph> {
  const response = await fetch(`${API_BASE_URL}/api/workflows/${name}`)
  if (!response.ok) throw new Error('Failed to fetch workflow graph')
  const data = await response.json()
  return data.graph
}

export function useWorkflow(name: string) {
  return useQuery({
    queryKey: ['workflow', name],
    queryFn: () => fetchWorkflow(name),
  })
}

export function useWorkflowGraph(name: string) {
  return useQuery({
    queryKey: ['workflow-graph', name],
    queryFn: () => fetchWorkflowGraph(name),
  })
}

