import "@xyflow/react/dist/style.css";
import "./flow.css";

import AIResponseNode from "./AIResponseNode";
import CustomNode from "./CustomNode";

import {
  Background,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "Integration",
      icon: "fluent-mdl2:account-management",
    },
    type: "custom",
  },
  {
    id: "2",
    position: { x: -150, y: 150 },
    data: {
      label: "Trigger Event",
      icon: "fluent-mdl2:trigger-approval",
    },
    type: "custom",
  },
  {
    id: "3",
    position: { x: 150, y: 150 },
    data: {
      label: "Fetch Data",
      icon: "fluent-mdl2:data-management-settings",
    },
    type: "custom",
  },
  {
    id: "4",
    position: { x: 0, y: 300 },
    data: {
      label: "Process Data",
      icon: "fluent-mdl2:processing",
    },
    type: "custom",
  },
  {
    id: "5",
    position: { x: 0, y: 450 },
    data: {
      label: "Decision Making",
      icon: "fluent-mdl2:decision-solid",
    },
    type: "custom",
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    style: { strokeDasharray: "5,5" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    style: { strokeDasharray: "5,5" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    style: { strokeDasharray: "5,5" },
  },
  {
    source: "3",
    target: "4",
    id: "xy-edge__3-4",
    style: { strokeDasharray: "5,5" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    style: { strokeDasharray: "5,5" },
  },
];

const nodeTypes = {
  custom: CustomNode,
  aiResponse: AIResponseNode,
};

export default function FlowReact({ aiResponse }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [processedResponses, setProcessedResponses] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

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

    return nodes.find((n) => n.id === "5");
  }, [nodes]);

  const addNodeFromAI = useCallback(
    (response) => {
      if (isAnimating || processedResponses.includes(response)) return;

      setIsAnimating(true);
      setProcessedResponses((prev) => [...prev, response]);

      const timestamp = Date.now();
      const newId = `ai-${timestamp}`;

      const lastNode = findLastNode();

      const newX = lastNode.position.x;
      const newY = lastNode.position.y + 150;

      const newNode = {
        id: newId,
        position: { x: newX, y: newY },
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
    [isAnimating, processedResponses, findLastNode, setNodes, setEdges]
  );

  useEffect(() => {
    if (aiResponse && !isAnimating) {
      addNodeFromAI(aiResponse);
    }
  }, [aiResponse, addNodeFromAI, isAnimating]);

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
