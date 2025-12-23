import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from 'reactflow';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '120',
  'elk.spacing.nodeNode': '100',
  'elk.direction': 'DOWN',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.cycleBreaking.strategy': 'GREEDY',
  'elk.padding': '[top=50,left=50,bottom=50,right=50]'
};

interface LayoutOptions {
  nodeWidth: number;
  nodeHeight: number;
  direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

export const elkLayout = async (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const graph = {
    id: 'root',
    layoutOptions: {
      ...elkOptions,
      'elk.direction': options.direction || 'DOWN'
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: options.nodeWidth,
      height: options.nodeHeight
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target]
    }))
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0
      }
    };
  });

  return {
    nodes: layoutedNodes,
    edges
  };
};

