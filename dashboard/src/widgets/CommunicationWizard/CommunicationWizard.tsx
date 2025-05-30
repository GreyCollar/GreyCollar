import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CommunicationChannelSelection from "./CommunicationChannelSelection";
import CommunicationInputDialog from "./CommunicationInputDialog";
import CommunicationResponsibilitySelection from "./CommunicationResponsibilitySelection";
import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
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
  const [tabIndex, setTabIndex] = React.useState(0);
  const [leftSelection, setLeftSelection] = React.useState(null);
  const [selectedRights, setSelectedRights] = React.useState([]);
  const [inputDialogOpen, setInputDialogOpen] = React.useState(false);
  const [pendingChannelOption, setPendingChannelOption] = React.useState(null);

  const handleDialogClose = () => {
    onClose();
    setTabIndex(0);
    setLeftSelection(null);
    setSelectedRights([]);
    setInputDialogOpen(false);
    setPendingChannelOption(null);
  };

  const handleTabChange = (_event, newValue) => setTabIndex(newValue);

  const handleChannelSelect = (channelId) => {
    setLeftSelection(channelId);
    setTabIndex(1);
  };

  const handleChannelAddRequest = (optionId) => {
    const option = (availableChannels || []).find((c) => c.id === optionId);
    if (!option) return;

    if (option.requiresInput) {
      setPendingChannelOption(option);
      setInputDialogOpen(true);
    } else {
      const newChannel = {
        type: option.id,
        id: option.id,
        label: option.label,
        icon: option.icon,
        code: option.id,
      };
      onAddChannel && onAddChannel(newChannel);
      setLeftSelection(newChannel.id);
      setTabIndex(1);
    }
  };
  const handleInputDialogSubmit = (channelOption, inputValue) => {
    if (channelOption) {
      const newChannel = {
        type: channelOption.id,
        id: channelOption.id + "-" + inputValue,
        label: `${channelOption.label} (${inputValue})`,
        icon: channelOption.icon,
        code: inputValue,
      };
      onAddChannel && onAddChannel(newChannel);
      setLeftSelection(newChannel.id);
      setTabIndex(1);
    }
    setInputDialogOpen(false);
    setPendingChannelOption(null);
  };

  const handleConnect = async () => {
    if (!leftSelection) return;
    if (onConnect) await onConnect(leftSelection, selectedRights);
    handleDialogClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>Connect Channel to Responsibility</DialogTitle>
        <DialogContent sx={{ minHeight: 200 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      border: tabIndex === 0 ? "1px solid" : "none",
                      borderColor: "divider",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: tabIndex !== 0 ? "primary.main" : "inherit",
                    }}
                  >
                    {tabIndex === 0 ? (
                      "1"
                    ) : (
                      <CheckCircleIcon fontSize="small" />
                    )}
                  </Typography>
                  Channel
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    2
                  </Typography>
                  Responsibility
                </Box>
              }
              disabled={!leftSelection}
            />
          </Tabs>
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px dashed rgba(145, 158, 171, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {tabIndex === 0 && (
              <CommunicationChannelSelection
                channels={channels}
                availableChannels={availableChannels}
                leftSelection={leftSelection}
                onChannelSelect={handleChannelSelect}
                onChannelDelete={onDeleteChannel}
                onChannelAddRequest={handleChannelAddRequest}
              />
            )}
            {tabIndex === 1 && leftSelection && (
              <CommunicationResponsibilitySelection
                responsibilities={responsibilities}
                selectedRights={selectedRights}
                onRightsChange={setSelectedRights}
                responsibilityIcon={responsibilityIcon}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedRights.length || !leftSelection}
            variant="contained"
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      {pendingChannelOption && (
        <CommunicationInputDialog
          open={inputDialogOpen}
          onClose={() => {
            setInputDialogOpen(false);
            setPendingChannelOption(null);
          }}
          onSubmit={handleInputDialogSubmit}
          pendingChannelOption={pendingChannelOption}
        />
      )}
    </>
  );
};

export default CommunicationWizard;
