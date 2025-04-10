import "@xyflow/react/dist/style.css";
import "./flow.css";

import AIResponseNode from "./AIResponseNode";
import CustomNode from "./CustomNode";
import ELK from "elkjs/lib/elk.bundled.js";

import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const nodeTypes = {
  custom: CustomNode,
  aiResponse: AIResponseNode,
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
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

function ResponsibilityFlow({ aiResponse }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [processedResponses, setProcessedResponses] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const fetchData = async () => {
      const nodeResponse = await fetch("http://localhost:3001/nodes");
      const nodeData = await nodeResponse.json();

      const formattedNodes = nodeData.map((node) => ({
        id: node.id.toString(),
        position: { x: 0, y: 0 },
        data: {
          label: node.label,
          icon: node.icon,
        },
        type: "custom",
      }));

      const formattedEdges = nodeData
        .filter((node) => node.dependencyId)
        .map((node) => ({
          id: `e${node.dependencyId}-${node.id}`,
          source: node.dependencyId.toString(),
          target: node.id.toString(),
          style: { strokeDasharray: "5,5" },
        }));

      getLayoutedElements(formattedNodes, formattedEdges, {
        "elk.direction": "DOWN",
        ...elkOptions,
      }).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setIsLoading(false);
        setTimeout(() => fitView(), 50);
      });
    };

    fetchData();
  }, [setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const findLastNode = useCallback(() => {
    const aiNodes = nodes.filter((n) => n.id.startsWith("ai-"));

    if (aiNodes.length > 0) {
      const sortedNodes = [...aiNodes].sort((a, b) => {
        const aTime = parseInt(a.id.split("-")[1]);
        const bTime = parseInt(b.id.split("-")[1]);
        return bTime - aTime;
      });

      return sortedNodes[0];
    }

    const hasOutgoing = new Set();
    edges.forEach((edge) => {
      hasOutgoing.add(edge.source);
    });

    const terminalNodes = nodes.filter(
      (node) => !hasOutgoing.has(node.id) && !node.id.startsWith("ai-")
    );

    if (terminalNodes.length > 0) {
      return terminalNodes.sort((a, b) => b.position.y - a.position.y)[0];
    }

    return nodes.sort((a, b) => {
      const aId = parseInt(a.id);
      const bId = parseInt(b.id);
      return isNaN(aId) || isNaN(bId) ? 0 : bId - aId;
    })[0];
  }, [nodes, edges]);

  const addNodeFromAI = useCallback(
    (response) => {
      if (
        isAnimating ||
        processedResponses.includes(response) ||
        nodes.length === 0
      )
        return;

      setIsAnimating(true);
      setProcessedResponses((prev) => [...prev, response]);

      const timestamp = Date.now();
      const newId = `ai-${timestamp}`;

      const lastNode = findLastNode();
      if (!lastNode) return;

      const newNode = {
        id: newId,
        position: {
          x: lastNode.position.x,
          y: lastNode.position.y + 150,
        },
        data: {
          label: "Integration Response",
          icon: "https://cdn-icons-png.flaticon.com/512/4712/4712038.png",
        },
        type: "aiResponse",
      };

      setNodes((nds) => [...nds, newNode]);

      setTimeout(() => {
        const newEdge = {
          id: `e${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
          style: {
            strokeDasharray: "5,5",
            className: "animated-edge",
          },
          animated: true,
        };

        setEdges((eds) => [...eds, newEdge]);

        setTimeout(() => {
          setIsAnimating(false);
        }, 2500);
      }, 1000);
    },
    [
      isAnimating,
      processedResponses,
      findLastNode,
      setNodes,
      setEdges,
      nodes.length,
    ]
  );

  useEffect(() => {
    if (aiResponse && !isAnimating && !isLoading) {
      addNodeFromAI(aiResponse);
    }
  }, [aiResponse, addNodeFromAI, isAnimating, isLoading]);

  if (isLoading) {
    return <div>Loading flow diagram...</div>;
  }

  return (
    <div style={{ width: "50vw", height: "90vh", overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.8,
          includeHiddenNodes: false,
        }}
        preventScrolling
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

function WrappedResponsibilityFlow(props) {
  return (
    <ReactFlowProvider>
      <ResponsibilityFlow {...props} />
    </ReactFlowProvider>
  );
}

export default WrappedResponsibilityFlow;
