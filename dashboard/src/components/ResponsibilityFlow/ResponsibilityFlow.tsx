import "@xyflow/react/dist/style.css";
import "./flow.css";

import AIResponseNode from "./AIResponseNode";
import CustomNode from "./CustomNode";
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
import {
  addStartNode,
  getLayoutedElements,
  getOptimizedElkOptions,
} from "../../utils/flowLayout";
import { useMediaQuery, useTheme } from "@mui/material";

const nodeTypes = {
  custom: CustomNode,
  aiResponse: AIResponseNode,
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
        height: "100%",
      };
    }
    if (isTablet) {
      return {
        width: "100%",
        height: "100%",
      };
    }
    return {
      width: "100%",
      height: "100%",
    };
  };

  useEffect(() => {
    if (!loading && responsibilityNodes) {
      const formattedNodes = responsibilityNodes.nodes.map((node) => ({
        id: node.id,
        position: { x: 0, y: 0 },
        data: {
          label: node.label,
          icon: node.icon,
          type: node.type,
        },
        type: "custom",
      }));

      const formattedEdges = responsibilityNodes.edges.map((edge) => ({
        id: `e${edge.source}-${edge.target}`,
        source: edge.source.toString(),
        target: edge.target.toString(),
        style: edge.style || { strokeDasharray: "5,5" },
        data: edge.data,
      }));

      const { nodes: nodesWithStart, edges: edgesWithStart } = addStartNode(
        formattedNodes,
        formattedEdges
      );

      getLayoutedElements(
        nodesWithStart,
        edgesWithStart,
        getOptimizedElkOptions(nodesWithStart, edgesWithStart)
      ).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
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
          type: node.type,
        },
        type: "custom",
      }));

      const formattedEdges = newEdges.map((edge) => ({
        id: `e${edge.source}-${edge.target}`,
        source: edge.source.toString(),
        target: edge.target.toString(),
        style: edge.style || { strokeDasharray: "5,5" },
        data: edge.data,
      }));

      const { nodes: nodesWithStart, edges: edgesWithStart } = addStartNode(
        formattedNodes,
        formattedEdges
      );

      getLayoutedElements(
        nodesWithStart,
        edgesWithStart,
        getOptimizedElkOptions(nodesWithStart, edgesWithStart)
      ).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes((prev) => [...prev, ...layoutedNodes]);
        setEdges((prev) => [...prev, ...layoutedEdges]);
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
        minHeight: isMobile ? "250px" : isTablet ? "300px" : "350px",
        maxHeight: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: nodes.length < 5 ? 0.7 : 0.1,
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
