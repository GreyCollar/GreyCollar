import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const CommunicationInputDialog = ({
  open,
  onClose,
  onSubmit,
  pendingChannelOption,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (open) {
      setInputValue(""); // Reset input value when dialog opens
    }
  }, [open]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (pendingChannelOption && inputValue.trim()) {
      onSubmit(pendingChannelOption, inputValue.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {pendingChannelOption?.inputLabel || "Enter Channel Information"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={pendingChannelOption?.inputLabel || "Input"}
          type="text"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommunicationInputDialog;
