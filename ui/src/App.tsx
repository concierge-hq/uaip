import { useState } from 'react'
import { WorkflowVisualizer } from './components/WorkflowVisualizer'
import { useWorkflows } from './hooks/useWorkflows'

function App() {
  const { data: workflows, isLoading, error } = useWorkflows()
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('stock_exchange')

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading workflows...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-lg text-destructive">Error loading workflows</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Concierge</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Workflow:</span>
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {workflows?.map((wf) => (
                <option key={wf.name} value={wf.name}>
                  {wf.description} ({wf.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <WorkflowVisualizer workflowName={selectedWorkflow} />
      </div>
    </div>
  )
}

export default App

