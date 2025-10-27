import { useState } from 'react'
import { ChevronRight, ChevronDown, Circle, Box, Wrench, PlayCircle } from 'lucide-react'
import type { Workflow } from '../types/workflow'
import { cn } from '../lib/utils'

interface WorkflowSidebarProps {
  workflow: Workflow
  selectedStage: string | null
  selectedTask: string | null
  onStageSelect: (stageName: string) => void
  onTaskSelect: (taskName: string) => void
}

export function WorkflowSidebar({
  workflow,
  selectedStage,
  selectedTask,
  onStageSelect,
  onTaskSelect,
}: WorkflowSidebarProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(Object.keys(workflow.stages))
  )

  const toggleStage = (stageName: string) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stageName)) {
      newExpanded.delete(stageName)
    } else {
      newExpanded.add(stageName)
    }
    setExpandedStages(newExpanded)
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Workflow Structure
        </h2>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {Object.entries(workflow.stages).map(([stageName, stage]) => {
            const isExpanded = expandedStages.has(stageName)
            const isStageSelected = selectedStage === stageName
            const isInitial = workflow.initial_stage === stageName
            const taskCount = Object.keys(stage.tasks).length

            return (
              <div key={stageName}>
                {/* Stage Row */}
                <button
                  onClick={() => {
                    onStageSelect(stageName)
                    if (!isExpanded) {
                      toggleStage(stageName)
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors group',
                    isStageSelected
                      ? 'bg-indigo-50 text-indigo-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStage(stageName)
                    }}
                    className="p-0.5 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>

                  {isInitial ? (
                    <PlayCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Box className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  )}

                  <span className="flex-1 text-left font-medium truncate">{stageName}</span>

                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {taskCount}
                  </span>
                </button>

                {/* Tasks */}
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {Object.keys(stage.tasks).map((taskName) => {
                      const isTaskSelected = selectedTask === taskName && isStageSelected

                      return (
                        <button
                          key={taskName}
                          onClick={() => {
                            onStageSelect(stageName)
                            onTaskSelect(taskName)
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                            isTaskSelected
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'hover:bg-gray-50 text-gray-600'
                          )}
                        >
                          <Wrench className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-1 text-left truncate font-mono">
                            {taskName}
                          </span>
                        </button>
                      )
                    })}

                    {/* Transitions */}
                    {stage.transitions && stage.transitions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2.5 mb-1">
                          Transitions to
                        </div>
                        {stage.transitions.map((target) => (
                          <button
                            key={target}
                            onClick={() => onStageSelect(target)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            <Circle className="w-2 h-2 fill-current" />
                            <span className="flex-1 text-left truncate">{target}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

