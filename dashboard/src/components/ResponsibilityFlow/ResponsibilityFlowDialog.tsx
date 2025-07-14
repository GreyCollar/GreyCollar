import React from "react";
import WrappedResponsibilityFlow from "./ResponsibilityFlow";

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
    <Dialog open={flowDialogOpen} onClose={handleFlowDialogClose} maxWidth="lg">
      <DialogTitle>Flow Chart</DialogTitle>
      <DialogContent>
        {selectedItem && (
          <WrappedResponsibilityFlow
            aiResponse={aiResponse}
            responsibility={selectedItem}
          />
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
