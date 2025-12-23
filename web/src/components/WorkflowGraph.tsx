import { useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { elkLayout } from '../utils/elkLayout';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

interface StageNodeData {
  label: string;
  description?: string;
  tasks?: string[];
  isInitial?: boolean;
}

const StageNode = ({ data, selected }: NodeProps<StageNodeData>) => {
  const isInitial = data.isInitial;

  return (
    <>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div
        className={`
          px-5 py-4 rounded-xl border-2 bg-white shadow-sm
          dark:bg-gray-800
          ${isInitial 
            ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' 
            : selected
              ? 'border-indigo-400 shadow-md'
              : 'border-gray-300 dark:border-gray-700'
          }
          transition-all hover:shadow-xl hover:border-indigo-400 cursor-pointer
        `}
        style={{ 
          width: NODE_WIDTH, 
          height: NODE_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div 
              className={`
                font-bold text-base leading-tight
                ${isInitial 
                  ? 'text-indigo-700 dark:text-indigo-400' 
                  : 'text-gray-900 dark:text-gray-100'
                }
              `}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}
            >
              {data.label}
            </div>
            {isInitial && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </div>
          
          {data.tasks && data.tasks.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{data.tasks.length} task{data.tasks.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </>
  );
};

const nodeTypes = {
  stageNode: StageNode
};

interface GraphProps {
  graph: {
    nodes: Array<{
      id: string;
      data: StageNodeData;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
  onNodeClick?: (nodeId: string, nodeData: StageNodeData) => void;
}

const GraphInner = ({ graph, onNodeClick }: GraphProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { fitView } = useReactFlow();

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id, node.data as StageNodeData);
    }
  };

  useEffect(() => {
    const layoutGraph = async () => {
      if (!graph || !graph.nodes || graph.nodes.length === 0) {
        setNodes([]);
        setEdges([]);
        return;
      }

      // Convert to ReactFlow format
      const flowNodes: Node[] = graph.nodes.map((node) => ({
        id: node.id,
        type: 'stageNode',
        data: node.data,
        position: { x: 0, y: 0 }
      }));

      const flowEdges: Edge[] = graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 24,
          height: 24,
          color: '#818cf8'
        },
        style: {
          stroke: '#818cf8',
          strokeWidth: 2.5
        }
      }));

      // Layout with ELK - horizontal (left to right)
      const layouted = await elkLayout(flowNodes, flowEdges, {
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        direction: 'RIGHT'
      });

      setNodes(layouted.nodes);
      setEdges(layouted.edges);

      // Fit view after layout with more padding
      setTimeout(() => {
        fitView({ padding: 0.3, duration: 200, minZoom: 0.5, maxZoom: 1.5 });
      }, 50);
    };

    layoutGraph();
  }, [graph, fitView]);

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No graph data available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={4}
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1}
          className="bg-gray-50 dark:bg-gray-900"
        />
        <Controls 
          position="bottom-right"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowGraph = ({ graph, onNodeClick }: GraphProps) => {
  return (
    <ReactFlowProvider>
      <GraphInner graph={graph} onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
};
