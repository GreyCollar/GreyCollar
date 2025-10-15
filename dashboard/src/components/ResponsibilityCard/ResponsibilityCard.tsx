import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import TaskIcon from "@mui/icons-material/Task";

import {
  Box,
  Card,
  Fab,
  IconButton,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  CustomPopover,
  Iconify,
  usePopover,
} from "@canmingir/link/platform/components";

const ResponsibilityCard = ({
  item,
  handleDrawerOpen,
  handleFlowDialogOpen,
  removeResponsibility,
  colleagueId,
}) => {
  const popover = usePopover();

  return (
    <Card key={item.id} sx={{ width: "60%", margin: "0 auto", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          position: "relative",
          gap: 1,
          borderRadius: 5,
          padding: 3,
          height: 250,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: 22,
            top: 18,
          }}
        >
          <Fab
            data-cy="responsibility-more-vert"
            color="default"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              boxShadow: 2,
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.23)",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Fab>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 4,
              paddingBottom: 2,
            }}
          >
            <SourcedAvatar
              sx={{
                width: 36,
                height: 36,
                mb: 1,
                bgcolor: "primary.main",
              }}
            >
              <TaskIcon />
            </SourcedAvatar>

            <ListItemText
              primary={<Typography color="inherit">{item.title}</Typography>}
              secondary={item.description}
              primaryTypographyProps={{
                typography: "subtitle1",
              }}
              secondaryTypographyProps={{
                mt: 1,
                color: "text.disabled",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: 84,
            bottom: 22,
          }}
        >
          <Fab
            color="default"
            size="small"
            data-cy="flow-icon"
            onClick={() => handleFlowDialogOpen(item)}
          >
            <AccountTreeIcon />
          </Fab>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: 28,
            bottom: 22,
          }}
        >
          <Fab
            color="default"
            size="small"
            data-cy="edit-icon"
            onClick={() => handleDrawerOpen(item)}
          >
            <EditIcon />
          </Fab>
        </Box>
      </Box>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          data-cy="responsibility-menu-view"
          onClick={() => {
            popover.onClose();
            handleFlowDialogOpen(item);
          }}
        >
          <AccountTreeIcon />
          Flow
        </MenuItem>

        <MenuItem
          data-cy="responsibility-menu-edit"
          onClick={() => {
            popover.onClose();
            handleDrawerOpen(item);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          data-cy="responsibility-menu-delete"
          onClick={() => {
            removeResponsibility(item.id, colleagueId);
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </CustomPopover>
    </Card>
  );
};

export default ResponsibilityCard;
