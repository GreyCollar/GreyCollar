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
      onAddChannel &&
        onAddChannel({
          type: option.id,
          id: option.id,
          label: option.label,
          icon: option.icon,
          code: option.id,
        });
    }
  };
  const handleInputDialogSubmit = (channelOption, inputValue) => {
    if (channelOption) {
      onAddChannel &&
        onAddChannel({
          type: channelOption.id,
          id: channelOption.id,
          label: `${channelOption.label} (${inputValue})`,
          icon: channelOption.icon,
          code: inputValue,
        });
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
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Connect Channel to Responsibility</DialogTitle>
        <DialogContent dividers>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Channel" />
            <Tab label="Responsibility" disabled={!leftSelection} />
          </Tabs>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
