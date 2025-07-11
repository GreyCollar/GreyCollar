import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

type Node = {
  id: string;
  position: { x: number; y: number };
  data: { label: string; icon: string };
  type: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  style?: { strokeDasharray: string };
};

export const addStartNode = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  const START_NODE_ID = "start-node";

  const startNode = {
    id: START_NODE_ID,
    position: { x: 0, y: 0 },
    data: {
      label: "Start",
      icon: "mdi:play-circle",
    },
    type: "custom",
  };

  const targetNodeIds = edges.map((edge) => edge.target);
  const firstNodes = nodes.filter((node) => !targetNodeIds.includes(node.id));

  const startEdges = firstNodes.map((node, index) => ({
    id: `start-edge-${index}`,
    source: START_NODE_ID,
    target: node.id,
    style: { strokeDasharray: "5,5" },
  }));

  return {
    nodes: [startNode, ...nodes],
    edges: [...startEdges, ...edges],
  };
};

export const getOptimizedElkOptions = (nodes, edges) => {
  const incomingEdgesCount: { [key: string]: number } = {};
  const outgoingEdgesCount: { [key: string]: number } = {};
  const parentNodesByChild: { [key: string]: string[] } = {};
  const childNodesByParent: { [key: string]: string[] } = {};
  const conditionEdges: { [key: string]: { true: string[]; false: string[] } } =
    {};

  edges.forEach((edge) => {
    if (!incomingEdgesCount[edge.target]) {
      incomingEdgesCount[edge.target] = 0;
      parentNodesByChild[edge.target] = [];
    }
    incomingEdgesCount[edge.target]++;
    parentNodesByChild[edge.target].push(edge.source);

    if (!outgoingEdgesCount[edge.source]) {
      outgoingEdgesCount[edge.source] = 0;
      childNodesByParent[edge.source] = [];
    }
    outgoingEdgesCount[edge.source]++;
    childNodesByParent[edge.source].push(edge.target);

    if (edge.data?.conditionResult) {
      if (!conditionEdges[edge.source]) {
        conditionEdges[edge.source] = { true: [], false: [] };
      }
      if (edge.data.conditionResult === "true") {
        conditionEdges[edge.source].true.push(edge.target);
      } else if (edge.data.conditionResult === "false") {
        conditionEdges[edge.source].false.push(edge.target);
      }
    }
  });

  const hasConditionalBranching = Object.keys(conditionEdges).length > 0;
  const hasMultipleBranches = Object.values(outgoingEdgesCount).some(
    (count: number) => count > 1
  );
  const hasMergePoints = Object.values(incomingEdgesCount).some(
    (count: number) => count > 1
  );
  const maxBranchingFactor = Math.max(
    ...(Object.values(outgoingEdgesCount) as number[]),
    0
  );
  const maxMergingFactor = Math.max(
    ...(Object.values(incomingEdgesCount) as number[]),
    0
  );

  let elkOptions: {
    [key: string]: string | number | boolean;
  } = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.spacing.nodeNode": "80",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.spacing.edgeNodeBetweenLayers": "60",
    "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    "elk.layered.thoroughness": "7",
    "elk.layered.unnecessaryBendpoints": "true",
    "elk.layered.spacing.baseValue": "15",
    "elk.layered.nodePlacement.networkSimplex.nodeFlexibility.default": "0.1",
    "elk.layered.nodePlacement.favorStraightEdges": "true",
    "elk.layered.edgeRouting.selfLoopDistribution": "EQUALLY",
    "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
    "elk.layered.nodePlacement.linearSegments.deflectionDampening": "0.1",
    "elk.layered.spacing.edgeEdgeBetweenLayers": "10",
    "elk.portConstraints": "FIXED_ORDER",
  };

  if (hasConditionalBranching) {
    elkOptions = {
      ...elkOptions,
      "elk.layered.spacing.nodeNodeBetweenLayers": "150",
      "elk.spacing.nodeNode": "120",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.favorStraightEdges": "false",
      "elk.layered.mergeEdges": "false",
      "elk.layered.allowNonFlowPortsToSwitchSides": "true",
    };
  }

  if (hasMultipleBranches && maxBranchingFactor > 2) {
    elkOptions = {
      ...elkOptions,
      "elk.layered.spacing.nodeNodeBetweenLayers": Math.max(
        120,
        maxBranchingFactor * 30
      ).toString(),
      "elk.spacing.nodeNode": Math.max(100, maxBranchingFactor * 25).toString(),
      "elk.layered.nodePlacement.networkSimplex.nodeFlexibility.default": "0.2",
    };
  }

  if (hasMergePoints && maxMergingFactor > 2) {
    elkOptions = {
      ...elkOptions,
      "elk.layered.spacing.edgeSpacing": "15",
      "elk.layered.mergeEdges": "true",
      "elk.layered.nodePlacement.favorStraightEdges": "true",
    };
  }

  if (hasConditionalBranching && hasMergePoints) {
    elkOptions = {
      ...elkOptions,
      "elk.layered.thoroughness": "10",
      "elk.layered.spacing.nodeNodeBetweenLayers": "180",
      "elk.spacing.nodeNode": "150",
      "elk.layered.nodePlacement.linearSegments.deflectionDampening": "0.05",
    };
  }

  return elkOptions;
};

export const centerMergePoints = (nodes, edges) => {
  const adjustedNodes = [...nodes];

  const incomingEdgesCount: { [key: string]: number } = {};
  const outgoingEdgesCount: { [key: string]: number } = {};
  const parentNodesByChild: { [key: string]: string[] } = {};
  const childNodesByParent: { [key: string]: string[] } = {};
  const conditionEdges: { [key: string]: { true: string[]; false: string[] } } =
    {};

  edges.forEach((edge) => {
    if (!incomingEdgesCount[edge.target]) {
      incomingEdgesCount[edge.target] = 0;
      parentNodesByChild[edge.target] = [];
    }
    incomingEdgesCount[edge.target]++;
    parentNodesByChild[edge.target].push(edge.source);

    if (!outgoingEdgesCount[edge.source]) {
      outgoingEdgesCount[edge.source] = 0;
      childNodesByParent[edge.source] = [];
    }
    outgoingEdgesCount[edge.source]++;
    childNodesByParent[edge.source].push(edge.target);

    if (edge.data?.conditionResult) {
      if (!conditionEdges[edge.source]) {
        conditionEdges[edge.source] = { true: [], false: [] };
      }
      if (edge.data.conditionResult === "true") {
        conditionEdges[edge.source].true.push(edge.target);
      } else if (edge.data.conditionResult === "false") {
        conditionEdges[edge.source].false.push(edge.target);
      }
    }
  });

  Object.keys(incomingEdgesCount).forEach((nodeId) => {
    if (incomingEdgesCount[nodeId] > 1) {
      const parentNodes = parentNodesByChild[nodeId]
        .map((parentId) => adjustedNodes.find((n) => n.id === parentId))
        .filter(Boolean);

      if (parentNodes.length > 1) {
        const parentXPositions = parentNodes.map((n) => n.position.x);
        const minX = Math.min(...parentXPositions);
        const maxX = Math.max(...parentXPositions);
        const centerX = (minX + maxX) / 2;

        const childNodeIndex = adjustedNodes.findIndex((n) => n.id === nodeId);
        if (childNodeIndex !== -1) {
          adjustedNodes[childNodeIndex] = {
            ...adjustedNodes[childNodeIndex],
            position: {
              ...adjustedNodes[childNodeIndex].position,
              x: centerX,
            },
          };
        }
      }
    }
  });

  Object.keys(outgoingEdgesCount).forEach((nodeId) => {
    if (outgoingEdgesCount[nodeId] > 1 && !conditionEdges[nodeId]) {
      const childNodes = childNodesByParent[nodeId]
        .map((childId) => adjustedNodes.find((n) => n.id === childId))
        .filter(Boolean);

      if (childNodes.length > 1) {
        const childXPositions = childNodes.map((n) => n.position.x);
        const minX = Math.min(...childXPositions);
        const maxX = Math.max(...childXPositions);
        const centerX = (minX + maxX) / 2;

        const parentNodeIndex = adjustedNodes.findIndex((n) => n.id === nodeId);
        if (parentNodeIndex !== -1) {
          adjustedNodes[parentNodeIndex] = {
            ...adjustedNodes[parentNodeIndex],
            position: {
              ...adjustedNodes[parentNodeIndex].position,
              x: centerX,
            },
          };
        }
      }
    }
  });

  return adjustedNodes;
};

export const getLayoutedElements = (nodes, edges, options = {}) => {
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      width: 200,
      height: 100,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => {
      const initialNodes = layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      }));

      const centeredNodes = centerMergePoints(initialNodes, edges);

      return {
        nodes: centeredNodes,
        edges: layoutedGraph.edges,
      };
    })
    .catch((error) => {
      console.error(error);
      return {
        nodes: nodes.map((node) => ({
          ...node,
          position: node.position || { x: 0, y: 0 },
        })),
        edges: edges,
      };
    });
};
