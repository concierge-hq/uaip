import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { ArrowLeft, Home, ChevronRight } from 'lucide-react'
import { useWorkflow } from '../hooks/useWorkflow'
import { WorkflowGraph } from '../components/WorkflowGraph'
import { WorkflowSidebar } from '../components/WorkflowSidebar'
import { DetailsPanel } from '../components/DetailsPanel'
import { AppHeader } from '../components/AppHeader'

export function WorkflowDetail() {
  const { workflowName } = useParams<{ workflowName: string }>()
  const { data, isLoading, error } = useWorkflow(workflowName || '')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow not found</h3>
          <p className="text-sm text-gray-600 mb-4">
            The workflow you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { workflow, graph } = data

  return (
    <ReactFlowProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <AppHeader />
        
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-6 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{workflow.description || workflow.name}</span>
            <span className="ml-auto text-xs text-gray-500">
              {Object.keys(workflow.stages).length} stages
            </span>
          </div>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <WorkflowSidebar
            workflow={workflow}
            selectedStage={selectedStage}
            selectedTask={selectedTask}
            onStageSelect={setSelectedStage}
            onTaskSelect={setSelectedTask}
          />

          {/* Center - Graph */}
          <div className="flex-1 flex flex-col bg-white border-l border-r border-gray-200">
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Execution Flow</h2>
            </div>
            
            <div className="flex-1">
              <WorkflowGraph
                graph={graph}
                selectedStage={selectedStage}
                onStageClick={setSelectedStage}
              />
            </div>
          </div>

          {/* Right Panel - Details */}
          <DetailsPanel
            workflow={workflow}
            selectedStage={selectedStage}
            selectedTask={selectedTask}
            onClose={() => {
              setSelectedStage(null)
              setSelectedTask(null)
            }}
          />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

