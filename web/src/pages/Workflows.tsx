import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Workflow, ChevronRight, Trash2 } from 'lucide-react'
import { useWorkflows } from '../hooks/useWorkflows'
import { API_BASE_URL } from '../config'

export function Workflows() {
  const { data: workflows, isLoading, refetch } = useWorkflows()
  const [terminating, setTerminating] = useState<string | null>(null)

  const handleTerminate = async (e: React.MouseEvent, workflowName: string) => {
    e.preventDefault()
    e.stopPropagation()
    setTerminating(workflowName)
    try {
      await fetch(`${API_BASE_URL}/api/workflows/${workflowName}`, { method: 'DELETE' })
      refetch()
    } catch (err) {
      console.error('Failed to terminate:', err)
    } finally {
      setTerminating(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workflows</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and configure your workflows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows?.map((workflow) => (
          <Link
            key={workflow.name}
            to={`/workflows/${workflow.name}`}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
                <Workflow className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {workflow.display_name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                {workflow.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {workflow.description || 'No description available'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
              </div>
              <button
                onClick={(e) => handleTerminate(e, workflow.name)}
                disabled={terminating === workflow.name}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                title="Terminate workflow"
              >
                <Trash2 className={`w-4 h-4 ${terminating === workflow.name ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


