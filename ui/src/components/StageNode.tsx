import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Box, PlayCircle } from 'lucide-react'
import { cn } from '../lib/utils'

interface StageNodeData {
  label: string
  description: string
  taskCount: number
  isInitial: boolean
  tasks: string[]
  isSelected?: boolean
}

export const StageNode = memo(({ data }: { data: StageNodeData }) => {
  const layerCount = Math.min(data.taskCount, 3)
  
  return (
    <div className="relative">
      {layerCount > 1 && (
        <>
          {[...Array(layerCount - 1)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-lg"
              style={{
                transform: `translate(${(i + 1) * 2}px, ${(i + 1) * 2}px)`,
                opacity: 0.5 - (i * 0.15),
                zIndex: -(i + 1),
              }}
            />
          ))}
        </>
      )}
      
      <div
        className={cn(
          'relative min-w-[180px] max-w-[180px] bg-white rounded-lg border shadow-sm transition-all duration-200',
          data.isSelected
            ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100'
            : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <Handle id="left" type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />
        <Handle id="top" type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />
        <Handle id="bottom" type="target" position={Position.Bottom} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />

        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            {data.isInitial ? (
              <PlayCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            ) : (
              <Box className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            )}
            <h4 className="font-semibold text-xs text-gray-900 leading-tight truncate">
              {data.label}
            </h4>
          </div>
          
          <div className="flex items-center gap-1.5 mb-2">
            {data.isInitial && (
              <span className="px-1.5 py-0.5 bg-green-100 border border-green-200 rounded text-[9px] font-semibold text-green-700">
                START
              </span>
            )}
            <span className="text-[10px] text-gray-500">
              {data.taskCount} {data.taskCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {data.tasks && data.tasks.length > 0 && (
            <div className="space-y-0.5 mt-1.5 pt-1.5 border-t border-gray-100">
              {data.tasks.slice(0, 3).map((task, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[9px] text-gray-500 opacity-60">
                  <div className="w-1 h-1 rounded-full bg-indigo-300" />
                  <span className="truncate font-mono">{task}</span>
                </div>
              ))}
              {data.tasks.length > 3 && (
                <div className="text-[9px] text-gray-400 italic">
                  +{data.tasks.length - 3} more...
                </div>
              )}
            </div>
          )}
        </div>

        <Handle id="right" type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />
        <Handle id="top" type="source" position={Position.Top} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />
        <Handle id="bottom" type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-gray-400 !border-2 !border-white" />
      </div>
    </div>
  )
})

StageNode.displayName = 'StageNode'
