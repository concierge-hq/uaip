import { X, FileText, ArrowRight, ArrowLeft, AlertCircle, Info } from 'lucide-react'
import type { Workflow } from '../types/workflow'

interface DetailsPanelProps {
  workflow: Workflow
  selectedStage: string | null
  selectedTask: string | null
  onClose: () => void
}

export function DetailsPanel({ workflow, selectedStage, selectedTask, onClose }: DetailsPanelProps) {
  if (!selectedStage) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center p-8">
        <div className="text-center">
          <Info className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Select a stage or task</p>
          <p className="text-xs text-gray-400 mt-1">from the sidebar</p>
        </div>
      </div>
    )
  }

  const stage = workflow.stages[selectedStage]
  if (!stage) return null

  // If a task is selected, show task details
  if (selectedTask) {
    const task = stage.tasks[selectedTask]
    if (!task) return null

    return (
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Task Details
              </div>
              <h3 className="text-sm font-mono font-semibold text-gray-900">{selectedTask}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Description */}
          {task.description && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Input Parameters */}
          {task.input_schema && Object.keys(task.input_schema.properties || {}).length > 0 && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Input Parameters
                </h4>
              </div>

              <div className="space-y-3">
                {Object.entries(task.input_schema.properties).map(([paramName, param]) => (
                  <div key={paramName} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        {paramName}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="px-2 py-0.5 bg-blue-100 border border-blue-200 rounded text-[10px] font-semibold text-blue-700">
                          {param.type}
                        </span>
                        {task.input_schema.required?.includes(paramName) && (
                          <span className="px-2 py-0.5 bg-red-100 border border-red-200 rounded text-[10px] font-semibold text-red-700">
                            required
                          </span>
                        )}
                      </div>
                    </div>
                    {param.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">{param.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Schema */}
          {task.output_schema && (
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft className="w-4 h-4 text-green-600 transform rotate-180" />
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Output Schema
                </h4>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-green-400">
                  {JSON.stringify(task.output_schema, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show stage details if no task selected
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Stage Details
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{selectedStage}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Description */}
        {stage.description && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{stage.description}</p>
          </div>
        )}

        {/* Task Count */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Tasks</span>
            <span className="font-semibold text-gray-900">{Object.keys(stage.tasks).length}</span>
          </div>
        </div>

        {/* Transitions */}
        {stage.transitions && stage.transitions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-green-600" />
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Next Stages
              </div>
            </div>
            <div className="space-y-1.5">
              {stage.transitions.map((target) => (
                <div
                  key={target}
                  className="px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-sm font-medium text-green-900"
                >
                  {target}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {stage.prerequisites && stage.prerequisites.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Prerequisites
              </div>
            </div>
            <div className="space-y-1.5">
              {stage.prerequisites.map((prereq) => (
                <div
                  key={prereq}
                  className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-sm font-medium text-amber-900"
                >
                  {prereq}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>Click on a task in the sidebar to view detailed input/output schemas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

