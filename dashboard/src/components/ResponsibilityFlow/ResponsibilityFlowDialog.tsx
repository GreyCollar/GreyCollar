import FlowReact from "./ResponsibilityFlow";
import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ResponsibilityFlowDialog = ({
  flowDialogOpen,
  handleFlowDialogClose,
  selectedItem,
  aiResponse,
}) => {
  return (
    <Dialog open={flowDialogOpen} onClose={handleFlowDialogClose}>
      <DialogTitle>Flow Chart</DialogTitle>
      <DialogContent>
        {selectedItem && (
          <FlowReact responsibility={selectedItem} aiResponse={aiResponse} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFlowDialogClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponsibilityFlowDialog;
