import "@xyflow/react/dist/style.css";

import {
  Background,
  Handle,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { useCallback } from "react";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "Slack Integration",
      icon: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png",
    },
    type: "custom",
  },
  {
    id: "2",
    position: { x: 0, y: 150 },
    data: {
      label: "Trigger Event",
      icon: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
    },
    type: "custom",
  },
  {
    id: "3",
    position: { x: 0, y: 300 },
    data: {
      label: "Fetch Data",
      icon: "https://cdn-icons-png.flaticon.com/512/3602/3602123.png",
    },
    type: "custom",
  },
  {
    id: "4",
    position: { x: -150, y: 450 },
    data: {
      label: "Process Data",
      icon: "https://cdn-icons-png.flaticon.com/512/3209/3209265.png",
    },
    type: "custom",
  },
  {
    id: "5",
    position: { x: 150, y: 450 },
    data: {
      label: "Decision Making",
      icon: "https://cdn-icons-png.flaticon.com/512/1998/1998613.png",
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
    id: "e2-3",
    source: "2",
    target: "3",
    style: { strokeDasharray: "5,5" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    style: { strokeDasharray: "5,5" },
  },
  {
    source: "3",
    target: "5",
    id: "xy-edge__3-5",
    style: { strokeDasharray: "5,5" },
  },
];

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        color: "#333",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={data.icon}
        alt={data.label}
        width={24}
        height={24}
        style={{ marginBottom: "5px" }}
      />
      <div
        style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}
      >
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
        }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function FlowReact() {
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
