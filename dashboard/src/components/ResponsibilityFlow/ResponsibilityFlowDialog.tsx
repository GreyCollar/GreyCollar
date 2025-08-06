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
  const DEFAULT_DIALOG_HEIGHT = "600px";

  return (
    <Dialog
      open={flowDialogOpen}
      onClose={handleFlowDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Flow Chart</DialogTitle>
      <DialogContent
        sx={{
          width: "100%",
          height: DEFAULT_DIALOG_HEIGHT,
        }}
      >
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
