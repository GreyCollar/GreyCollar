import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Icon } from "@iconify/react";
import React from "react";

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const CommunicationWizard = ({
  open,
  onClose,
  channels,
  responsibilities,
  availableChannels,
  onAddChannel,
  onDeleteChannel,
  onConnect,
  responsibilityIcon,
}) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [leftSelection, setLeftSelection] = React.useState(null);
  const [selectedRights, setSelectedRights] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [inputDialogOpen, setInputDialogOpen] = React.useState(false);
  const [pendingChannelOption, setPendingChannelOption] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");

  const handleDialogClose = () => {
    onClose();
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
      onAddChannel &&
        onAddChannel({
          type: option.id,
          id: option.id,
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
      onAddChannel &&
        onAddChannel({
          type: pendingChannelOption.id,
          id: pendingChannelOption.id,
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

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Connect Channel to Responsibility</DialogTitle>
        <DialogContent dividers>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Channel" />
            <Tab label="Responsibility" disabled={!leftSelection} />
          </Tabs>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {tabIndex === 0 && (
              <>
                {channels.map((node) => (
                  <Card
                    key={node.id}
                    onClick={() => {
                      setLeftSelection(node.id);
                      setTabIndex(1);
                    }}
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
                        handleChannelDelete(node.id);
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
                    <MenuItem key={c.id} onClick={() => handleChannelAdd(c.id)}>
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
            )}
            {tabIndex === 1 &&
              (responsibilities || []).map((resp) => {
                const checked = selectedRights.includes(resp.id);
                return (
                  <Card
                    key={resp.id}
                    onClick={() => {
                      if (checked) {
                        setSelectedRights(
                          selectedRights.filter((id) => id !== resp.id)
                        );
                      } else {
                        setSelectedRights([...selectedRights, resp.id]);
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      cursor: "pointer",
                      border: checked
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Icon
                      icon={resp.icon || responsibilityIcon}
                      width="24"
                      height="24"
                    />
                    <Typography flexGrow={1}>{resp.title}</Typography>
                    <Box
                      component="span"
                      sx={{
                        color: checked
                          ? theme.palette.primary.main
                          : theme.palette.text.disabled,
                      }}
                    >
                      {checked ? "✓" : ""}
                    </Box>
                  </Card>
                );
              })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedRights.length}
            variant="contained"
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={inputDialogOpen}
        onClose={handleInputDialogClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {pendingChannelOption && pendingChannelOption.inputLabel
            ? pendingChannelOption.inputLabel
            : "Enter Channel Information"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={
              (pendingChannelOption && pendingChannelOption.inputLabel) ||
              "Input"
            }
            type="text"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInputDialogClose}>Cancel</Button>
          <Button
            onClick={handleInputSubmit}
            disabled={!inputValue.trim()}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunicationWizard;
