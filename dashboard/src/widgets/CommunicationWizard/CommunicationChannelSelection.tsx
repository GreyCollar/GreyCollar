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

  return (
    <>
      {channels.map((node) => (
        <Card
          key={node.id}
          onClick={() => onChannelSelect(node.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2,
            cursor: "pointer",
            border:
              leftSelection === node.id
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Icon icon={node.icon} width="24" height="24" />
            <Typography>{node.label}</Typography>
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
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={handleAddChannelClick}
      >
        Add Channel
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddChannelClose}
      >
        {(availableChannels || []).map((c) => (
          <MenuItem key={c.id} onClick={() => handleChannelOptionClick(c.id)}>
            <Icon
              icon={c.icon}
              width="24"
              height="24"
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
