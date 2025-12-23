import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { WorkflowGraph } from '../components/WorkflowGraph'
import { useWorkflowDetail } from '../hooks/useWorkflowDetail'
import { Stage, Task } from '../types'
import { API_BASE_URL } from '../config'

export function WorkflowDetail() {
  const { workflowName } = useParams<{ workflowName: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useWorkflowDetail(workflowName || '')
  const [activeTab, setActiveTab] = useState<'graph' | 'stages'>('graph')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [stageModalOpen, setStageModalOpen] = useState(false)
  const [terminating, setTerminating] = useState(false)

  const handleTerminate = async () => {
    setTerminating(true)
    try {
      await fetch(`${API_BASE_URL}/api/workflows/${workflowName}`, { method: 'DELETE' })
      navigate('/workflows')
    } catch (err) {
      console.error('Failed to terminate:', err)
      setTerminating(false)
    }
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedStage(nodeId)
  }

  const handleStageCardClick = (stageName: string) => {
    setSelectedStage(stageName)
    setStageModalOpen(true)
  }

  const selectedStageData = selectedStage ? data?.stages[selectedStage] : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-gray-500">Loading workflow details...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-red-500">Failed to load workflow details.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-6 bg-gray-50 dark:bg-gray-900">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{data.description}</p>
        </div>
        <button
          onClick={handleTerminate}
          disabled={terminating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors"
        >
          <Trash2 className={`w-4 h-4 ${terminating ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">{terminating ? 'Terminating...' : 'Terminate'}</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'graph'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stages'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Stages
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'graph' ? (
            <div className="h-full flex gap-4">
              <div className="flex-1">
                <WorkflowGraph graph={data.graph} onNodeClick={handleNodeClick} />
              </div>
              {selectedStageData && (
                <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedStageData.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tasks
                    </h4>
                    {selectedStageData.tasks && Object.values(selectedStageData.tasks).length > 0 ? (
                      (Object.values(selectedStageData.tasks) as Task[]).map((task: Task) => (
                        <div
                          key={task.name}
                          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {task.name}
                          </div>
                          {task.description && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {task.description}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                        No tasks defined
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.values(data.stages) as Stage[]).map((stage: Stage, index: number) => {
                    const taskCount = stage.tasks ? Object.values(stage.tasks).length : 0;
                    const isInitial = stage.name === data.initial_stage;
                    
                    return (
                      <div
                        key={stage.name}
                        onClick={() => handleStageCardClick(stage.name)}
                        className={`
                          group relative bg-white dark:bg-gray-800 rounded-lg border-2 p-5 
                          hover:shadow-lg transition-all cursor-pointer
                          ${isInitial 
                            ? 'border-indigo-500 shadow-md shadow-indigo-500/10' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                          }
                        `}
                      >
                        {isInitial && (
                          <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Start
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className={`
                              text-base font-semibold mb-1
                              ${isInitial 
                                ? 'text-indigo-700 dark:text-indigo-400' 
                                : 'text-gray-900 dark:text-white'
                              }
                            `}>
                              {stage.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {taskCount > 0 ? (
                          <div className="space-y-1.5">
                            {Object.values(stage.tasks).slice(0, 3).map((task: Task) => (
                              <div
                                key={task.name}
                                className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5"
                              >
                                <span className="text-indigo-500 mt-0.5">•</span>
                                <span className="flex-1">{task.name}</span>
                              </div>
                            ))}
                            {taskCount > 3 && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 italic pl-3">
                                +{taskCount - 3} more...
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 dark:text-gray-600 italic">
                            No tasks defined
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Stage {index + 1}
                          </span>
                          <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View details →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Details Modal */}
      {stageModalOpen && selectedStageData && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setStageModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedStageData.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Object.values(selectedStageData.tasks || {}).length} tasks in this stage
                </p>
              </div>
              <button
                onClick={() => setStageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {Object.values(selectedStageData.tasks || {}).length > 0 ? (
                <div className="space-y-3">
                  {(Object.values(selectedStageData.tasks) as Task[]).map((task: Task, index: number) => (
                    <div
                      key={task.name}
                      className="group p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                            {task.name}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">No tasks defined for this stage</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setStageModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

