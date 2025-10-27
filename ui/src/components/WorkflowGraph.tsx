import { useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Panel,
  useReactFlow,
  Node,
  Edge,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { StageNode } from './StageNode'
import type { WorkflowGraph as WorkflowGraphType } from '../types/workflow'

interface WorkflowGraphProps {
  graph: WorkflowGraphType
  selectedStage: string | null
  onStageClick: (stageName: string) => void
}

const nodeTypes = {
  stage: StageNode,
}

export function WorkflowGraph({ graph, selectedStage, onStageClick }: WorkflowGraphProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow()

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 100)
  }, [graph, fitView])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onStageClick(node.id)
    },
    [onStageClick]
  )

  const nodes: Node[] = graph.nodes.map((node) => ({
    ...node,
    type: 'stage',
    data: {
      ...node.data,
      taskCount: node.data.tasks?.length || 0,
      tasks: node.data.tasks || [],
      isSelected: node.id === selectedStage,
    },
  }))

  const edgeMap = new Map<string, boolean>()
  graph.edges.forEach((edge) => {
    const key = `${edge.source}-${edge.target}`
    const reverseKey = `${edge.target}-${edge.source}`
    edgeMap.set(key, edgeMap.has(reverseKey))
  })

  const isBackwardEdge = (edge: any) => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)
    if (!sourceNode || !targetNode) return false
    return (targetNode.position?.x || 0) < (sourceNode.position?.x || 0)
  }

  const isSkipConnection = (edge: any) => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)
    if (!sourceNode || !targetNode) return false
    
    const sourceX = sourceNode.position?.x || 0
    const targetX = targetNode.position?.x || 0
    const sourceY = sourceNode.position?.y || 0
    const targetY = targetNode.position?.y || 0
    
    if (Math.abs(sourceY - targetY) > 50) return false
    
    return nodes.some(n => {
      if (n.id === edge.source || n.id === edge.target) return false
      const nx = n.position?.x || 0
      const ny = n.position?.y || 0
      const isBetweenX = (sourceX < nx && nx < targetX) || (targetX < nx && nx < sourceX)
      const isSameRow = Math.abs(ny - sourceY) < 100
      return isBetweenX && isSameRow
    })
  }

  const edges: Edge[] = graph.edges.map((edge) => {
    const key = `${edge.source}-${edge.target}`
    const isBidirectional = edgeMap.get(key)
    const isBackward = isBackwardEdge(edge)
    const isSkip = isSkipConnection(edge)

    return {
      ...edge,
      type: 'smoothstep',
      style: {
        stroke: isSkip ? '#c4b5fd' : '#6366f1',
        strokeWidth: isSkip ? 1.5 : 2,
        strokeDasharray: isSkip ? '5,5' : undefined,
        opacity: isSkip ? 0.5 : 1,
      },
      ...(isSkip && {
        sourcePosition: 'top' as const,
        targetPosition: 'top' as const,
        sourceHandle: 'top',
        targetHandle: 'top',
      }),
      ...(isBackward && !isSkip && {
        sourcePosition: 'bottom' as const,
        targetPosition: 'bottom' as const,
        sourceHandle: 'bottom',
        targetHandle: 'bottom',
      }),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isSkip ? '#c4b5fd' : '#6366f1',
      },
      markerStart: isBidirectional ? {
        type: MarkerType.ArrowClosed,
        color: isSkip ? '#c4b5fd' : '#6366f1',
      } : undefined,
    }
  })

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            strokeWidth: 2,
            stroke: '#6366f1',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          },
        }}
        elevateEdgesOnSelect={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background
          gap={16}
          size={1}
          color="#e2e8f0"
          className="bg-gray-50"
        />
        <Controls
          showInteractive={false}
          className="!bg-white !border-gray-200 !shadow-sm"
        />

        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={() => zoomIn()}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => zoomOut()}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2, duration: 400 })}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            title="Fit to view"
          >
            <Maximize2 className="w-4 h-4 text-gray-700" />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
