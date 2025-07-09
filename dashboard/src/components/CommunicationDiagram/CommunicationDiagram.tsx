import { Icon } from "@iconify/react";

import {
  Box,
  Card,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";

const DEFAULT_RESPONSIBILITY_ICON =
  "healthicons:crisis-response-center-person-outline";

function CommunicationDiagram(props) {
  const {
    channels,
    responsibilities,
    connections,
    nodeWidth = 260,
    nodeHeight = 180,
    leftX = 0,
    horizontalGap = 500,
    initialTop = 20,
    verticalGap = 20,
    colorMap,
    containerProps,
    showRightIcons = true,
    showLeftIcons = true,
    responsibilityIcon = DEFAULT_RESPONSIBILITY_ICON,
    renderChannelNode,
    renderResponsibilityNode,
  } = props;

  const theme = useTheme();

  const positionsLeft = useMemo(
    () =>
      (channels || []).map((node, idx) => ({
        ...node,
        x: leftX,
        y: initialTop + idx * (nodeHeight + verticalGap),
      })),
    [channels, leftX, initialTop, nodeHeight, verticalGap]
  );

  const rightNodes = useMemo(
    () =>
      (responsibilities || []).map((resp, idx) => ({
        ...resp,
        id: resp.id,
        icon: resp.icon || responsibilityIcon,
        x: leftX + horizontalGap,
        y: initialTop + idx * (nodeHeight + verticalGap),
      })),
    [
      responsibilities,
      leftX,
      horizontalGap,
      initialTop,
      nodeHeight,
      verticalGap,
      responsibilityIcon,
    ]
  );

  const maxCount = Math.max(positionsLeft.length, rightNodes.length);
  const containerHeight = initialTop + maxCount * (nodeHeight + verticalGap);

  const internalColorMap = useMemo(
    () => ({
      whatsapp: theme.palette.success.main,
      slack: theme.palette.info.main,
      email: theme.palette.primary.main,
      ...colorMap,
    }),
    [theme, colorMap]
  );

  const renderEdges = () =>
    (connections || []).map(({ left, right }) => {
      const leftNode = positionsLeft.find((n) => n.id === left);
      const rightNode = rightNodes.find((n) => n.id === right);
      if (!leftNode || !rightNode) return null;

      const group = (connections || []).filter((c) => c.right === right);
      const index = group.findIndex(
        (c) => c.left === left && c.right === right
      );
      const offsetSpacing = verticalGap;
      const x1 = leftNode.x + nodeWidth;
      const y1 = leftNode.y + nodeHeight / 2;
      const baseY2 = rightNode.y + nodeHeight / 2;
      const y2 = baseY2 + (index - (group.length - 1) / 2) * offsetSpacing;
      const x2 = rightNode.x;
      const dx = (x2 - x1) / 2;
      const path = `M${x1},${y1} C${x1 + dx},${y1} ${
        x2 - dx
      },${y2} ${x2},${y2}`;
      const strokeColor =
        internalColorMap[leftNode.type] || theme.palette.text.secondary;
      return (
        <path
          key={`${left}-${right}`}
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          markerEnd={`url(#arrow-${left})`}
        />
      );
    });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} {...containerProps}>
      <Box
        position="relative"
        width={leftX + horizontalGap + nodeWidth}
        height={containerHeight}
        mx="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!connections || connections.length === 0 ? (
          <Stack sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
            No communication connections available.
          </Stack>
        ) : (
          <>
            {positionsLeft
              .filter((node) =>
                (connections || []).some((c) => c.left === node.id)
              )
              .map((node) =>
                renderChannelNode ? (
                  renderChannelNode(node)
                ) : (
                  <Card
                    key={node.id}
                    sx={{
                      position: "absolute",
                      width: nodeWidth,
                      height: nodeHeight,
                      top: node.y,
                      left: node.x,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    {showLeftIcons && (
                      <Icon icon={node.icon} width="48" height="48" />
                    )}
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 1, textAlign: "center" }}
                    >
                      {node.label}
                    </Typography>
                  </Card>
                )
              )}

            {rightNodes
              .filter((node) =>
                (connections || []).some((c) => c.right === node.id)
              )
              .map((node) =>
                renderResponsibilityNode ? (
                  renderResponsibilityNode(node)
                ) : (
                  <Card
                    key={node.id}
                    sx={{
                      position: "absolute",
                      width: nodeWidth,
                      height: nodeHeight,
                      top: node.y,
                      left: node.x,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    {showRightIcons && (
                      <Icon icon={node.icon} width="36" height="36" />
                    )}
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 1, textAlign: "center" }}
                    >
                      {node.title}
                    </Typography>
                  </Card>
                )
              )}

            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <defs>
                {positionsLeft.map((node) => (
                  <marker
                    key={node.id}
                    id={`arrow-${node.id}`}
                    markerWidth="6"
                    markerHeight="6"
                    refX="4.5"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L6,3 Z"
                      fill={
                        internalColorMap[node.type] ||
                        theme.palette.text.secondary
                      }
                    />
                  </marker>
                ))}
              </defs>
              {renderEdges()}
            </svg>
          </>
        )}
      </Box>
    </Container>
  );
}

export default CommunicationDiagram;
