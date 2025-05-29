import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

const ResponsibilityChatTitle = ({
  title,
  description,
  messages,
  handleCreateResponsibility,
  setTitle,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    handleCreateResponsibility(title, description);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        px: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {title === null && messages.length > 0 ? (
            <>
              <Skeleton variant="text" width={200} height={24} />
            </>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                }}
              >
                {title ? title : "Add Title"}
              </Typography>
              <IconButton onClick={handleEditClick}>
                {title ? <EditIcon /> : <AddIcon />}
              </IconButton>
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {description === null && messages.length > 0 ? (
            <Skeleton variant="text" width={200} height={24} />
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "350px",
                  flexGrow: 1,
                }}
              >
                {description}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={isEditing} onClose={handleCancelClick} fullWidth>
        <DialogTitle>
          {messages.length > 0
            ? "Edit Responsibility"
            : "Create Responsibility"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveClick} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsibilityChatTitle;
