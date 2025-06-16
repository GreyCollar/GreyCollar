import "@xyflow/react/dist/style.css";
import "./flow.css";

import AIResponseNode from "./AIResponseNode";
import CustomNode from "./CustomNode";
import ELK from "elkjs/lib/elk.bundled.js";
import { convertToNodesAndEdges } from "../../components/ResponsibilityFlow/flowAdapter";
import useResponsibility from "../../hooks/useResponsibility";

import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const elk = new ELK();

// ELK layout options
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

function ResponsibilityFlow({ aiResponse, responsibility }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(true);
  const { getResponsibilityWithNode } = useResponsibility();
  const { responsibilityNodes, loading } = getResponsibilityWithNode(
    responsibility?.id
  );

  const getFlowDimensions = () => {
    if (isMobile) {
      return {
        width: "100%",
        height: "40vh",
      };
    }
    if (isTablet) {
      return {
        width: "100%",
        height: "50vh",
      };
    }
    return {
      width: "100%",
      height: "95vh",
    };
  };

  const getDefaultViewport = () => {
    if (isMobile) {
      return { x: 20, y: 50, zoom: 0.6 };
    }
    if (isTablet) {
      return { x: 60, y: 100, zoom: 0.65 };
    }
    return { x: 120, y: 150, zoom: 0.75 };
  };

  useEffect(() => {
    if (!loading && responsibilityNodes) {
      const formattedNodes = responsibilityNodes.nodes.map((node) => ({
        id: node.id,
        position: { x: 0, y: 0 },
        data: {
          label: node.label,
          icon: node.icon,
        },
        type: "custom",
      }));

      const formattedEdges = responsibilityNodes.edges.map((edge) => ({
        id: `e${edge.source}-${edge.target}`,
        source: edge.source.toString(),
        target: edge.target.toString(),
        style: { strokeDasharray: "5,5" },
      }));

      getLayoutedElements(formattedNodes, formattedEdges, {
        "elk.direction": "DOWN",
        ...elkOptions,
      }).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, setNodes, setEdges]);

  useEffect(() => {
    if (aiResponse) {
      setNodes([]);
      setEdges([]);
      const { nodes: newNodes, edges: newEdges } = convertToNodesAndEdges(
        aiResponse?.flow
      );

      const formattedNodes = newNodes.map((node) => ({
        id: node.id,
        position: { x: 0, y: 0 },
        data: {
          label: node.label,
          icon: node.icon,
        },
        type: "custom",
      }));

      const formattedEdges = newEdges.map((edge) => ({
        id: `e${edge.source}-${edge.target}`,
        source: edge.source.toString(),
        target: edge.target.toString(),
        style: { strokeDasharray: "5,5" },
      }));

      getLayoutedElements(formattedNodes, formattedEdges, {
        "elk.direction": "DOWN",
        ...elkOptions,
      }).then(({ nodes: formattedNodes, edges: formattedEdges }) => {
        setNodes((prev) => [...prev, ...formattedNodes]);
        setEdges((prev) => [...prev, ...formattedEdges]);
        setIsLoading(false);
      });
    }
  }, [aiResponse, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (isLoading) {
    return <div>Loading flow diagram...</div>;
  }

  const flowDimensions = getFlowDimensions();

  return (
    <div
      style={{
        width: flowDimensions.width,
        height: flowDimensions.height,
        minHeight: isMobile ? "300px" : "400px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={getDefaultViewport()}
        fitView
        fitViewOptions={{
          padding: isMobile ? 0.1 : 0.2,
        }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider
function WrappedResponsibilityFlow(props) {
  return (
    <ReactFlowProvider>
      <ResponsibilityFlow {...props} />
    </ReactFlowProvider>
  );
}

export default WrappedResponsibilityFlow;
