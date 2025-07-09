import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Icon } from "@iconify/react";
import React from "react";

import {
  Box,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";

const CommunicationChannelSelection = ({
  channels,
  availableChannels,
  connections,
  leftSelection,
  onChannelSelect,
  onChannelDelete,
  onChannelAddRequest,
}: {
  channels: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  availableChannels?: Array<{
    id: string;
    label: string;
    icon: string;
    requiresInput?: boolean;
  }>;
  connections?: Array<{
    left: string;
    right: string;
  }>;
  leftSelection?: string | null;
  onChannelSelect: (channelId: string) => void;
  onChannelDelete: (channelId: string) => void;
  onChannelAddRequest: (optionId: string) => void;
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAddChannelClick = (event) => setAnchorEl(event.currentTarget);
  const handleAddChannelClose = () => setAnchorEl(null);

  const handleChannelOptionClick = (optionId) => {
    onChannelAddRequest(optionId);
    handleAddChannelClose();
  };

  const isChannelConnected = (channelId) => {
    return connections?.some((conn) => conn.left === channelId);
  };

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a channel to connect to a responsibility. Channels marked as
        &quot;Already Connected&quot; can only be disconnected, not connected to
        additional responsibilities.
      </Typography>
      {channels.map((node) => {
        const isConnected = isChannelConnected(node.id);
        return (
          <Card
            key={node.id}
            onClick={() => onChannelSelect(node.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              p: 2,
              mt: 2,
              cursor: isConnected ? "not-allowed" : "pointer",
              border:
                leftSelection === node.id
                  ? `2px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: isConnected
                ? theme.palette.warning.light + "20"
                : "transparent",
              opacity: isConnected ? 0.7 : 1,
              "&:hover": {
                backgroundColor: isConnected
                  ? theme.palette.warning.light + "30"
                  : theme.palette.action.hover,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Icon icon={node.icon} width="24" height="24" />
              <Box>
                <Typography>{node.label}</Typography>
                {isConnected && (
                  <Typography
                    variant="caption"
                    color="warning.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Already Connected
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onChannelDelete(node.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Card>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={handleAddChannelClick}
        sx={{
          mt: 2,
          width: "70%",
          alignSelf: "center",
        }}
      >
        Add Channel
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddChannelClose}
      >
        {(availableChannels || []).map((c) => (
          <MenuItem
            sx={{
              width: 180,
            }}
            key={c.id}
            onClick={() => handleChannelOptionClick(c.id)}
          >
            <Icon
              icon={c.icon}
              width="28"
              height="28"
              style={{ marginRight: 8 }}
            />
            {c.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CommunicationChannelSelection;
