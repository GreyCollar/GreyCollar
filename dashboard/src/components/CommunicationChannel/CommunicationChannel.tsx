import AddIcon from "@mui/icons-material/Add";
import ChannelConnectionDialog from "./ChannelConnectionDialog";
import { Icon } from "@iconify/react";

import { Box, Card, Container, Fab, Typography, useTheme } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";

const DEFAULT_RESPONSIBILITY_ICON =
  "healthicons:crisis-response-center-person-outline";

function CommunicationChannel(props) {
  const {
    channels,
    responsibilities,
    connections,
    availableChannels,
    onAddChannel,
    onDeleteChannel,
    onConnect,
    nodeWidth = 200,
    nodeHeight = 100,
    leftX = 0,
    horizontalGap = 500,
    initialTop = 20,
    verticalGap = 20,
    colorMap,
    addFab,
    containerProps,
    showRightIcons = true,
    showLeftIcons = true,
    responsibilityIcon = DEFAULT_RESPONSIBILITY_ICON,
    renderChannelNode,
    renderResponsibilityNode,
  } = props;

  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [leftSelection, setLeftSelection] = useState(null);
  const [selectedRights, setSelectedRights] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  const [pendingChannelOption, setPendingChannelOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const idCounter = useRef(0);

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

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTabIndex(0);
    setLeftSelection(null);
    setSelectedRights([]);
  };
  const handleTabChange = (_event, newValue) => setTabIndex(newValue);

  const handleAddChannelClick = (event) => setAnchorEl(event.currentTarget);
  const handleAddChannelClose = () => setAnchorEl(null);

  const handleChannelAdd = (optionId) => {
    const option = (availableChannels || []).find((c) => c.id === optionId);
    if (!option) return;
    if (option.requiresInput) {
      setPendingChannelOption(option);
      setInputValue("");
      setInputDialogOpen(true);
    } else {
      idCounter.current += 1;
      const instanceId = `${optionId}-${idCounter.current}`;
      onAddChannel &&
        onAddChannel({
          type: option.id,
          id: instanceId,
          label: option.label,
          icon: option.icon,
          code: option.id,
        });
    }
    handleAddChannelClose();
  };

  const handleInputDialogClose = () => {
    setInputDialogOpen(false);
    setPendingChannelOption(null);
    setInputValue("");
  };
  const handleInputSubmit = () => {
    if (pendingChannelOption) {
      idCounter.current += 1;
      const instanceId = `${pendingChannelOption.id}-${idCounter.current}`;
      onAddChannel &&
        onAddChannel({
          type: pendingChannelOption.id,
          id: instanceId,
          label: `${pendingChannelOption.label} (${inputValue})`,
          icon: pendingChannelOption.icon,
          code: inputValue,
        });
    }
    handleInputDialogClose();
  };

  const handleConnect = async () => {
    if (!leftSelection) return;
    if (onConnect) await onConnect(leftSelection, selectedRights);
    handleDialogClose();
  };

  const handleChannelDelete = async (channelId) => {
    if (onDeleteChannel) await onDeleteChannel(channelId);
    if (leftSelection === channelId) handleDialogClose();
  };

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

  const addConnectionFab = addFab || (
    <Fab
      variant="button"
      color="default"
      size="medium"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      onClick={() => setDialogOpen(true)}
      aria-label="Connect channel to responsibility"
    >
      <AddIcon />
    </Fab>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} {...containerProps}>
      <Box
        position="relative"
        width={leftX + horizontalGap + nodeWidth}
        height={containerHeight}
        mx="auto"
      >
        {positionsLeft
          .filter((node) => (connections || []).some((c) => c.left === node.id))
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
                  <Icon icon={node.icon} width="36" height="36" />
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

        {rightNodes.map((node) =>
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
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0 L0,8 L8,4 Z"
                  fill={
                    internalColorMap[node.type] || theme.palette.text.secondary
                  }
                />
              </marker>
            ))}
          </defs>
          {renderEdges()}
        </svg>

        {addConnectionFab}

        <ChannelConnectionDialog
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          handleTabChange={handleTabChange}
          leftSelection={leftSelection}
          setLeftSelection={setLeftSelection}
          channels={positionsLeft}
          theme={theme}
          handleChannelDelete={handleChannelDelete}
          handleAddChannelClick={handleAddChannelClick}
          selectedRights={selectedRights}
          setSelectedRights={setSelectedRights}
          responsibilityIcon={responsibilityIcon}
          responsibilities={rightNodes}
          anchorEl={anchorEl}
          handleAddChannelClose={handleAddChannelClose}
          availableChannels={availableChannels}
          handleChannelAdd={handleChannelAdd}
          inputDialogOpen={inputDialogOpen}
          pendingChannelOption={pendingChannelOption}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleInputDialogClose={handleInputDialogClose}
          handleInputSubmit={handleInputSubmit}
          handleConnect={handleConnect}
        />
      </Box>
    </Container>
  );
}

export default CommunicationChannel;
