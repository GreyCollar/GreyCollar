import Card from "@mui/material/Card";
import { Iconify } from "@canmingir/link/minimal/components";
import { Link } from "react-router-dom";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Typography from "@mui/material/Typography";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

// ----------------------------------------------------------------------

function StandardNode({ node, sx }) {
  const [open, setOpen] = React.useState(false);

  const projectId = localStorage.getItem("projectId");

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = (confirmed) => {
    setOpen(false);
    if (confirmed) {
      sessionStorage.setItem("fromLink", `true`);
      sessionStorage.setItem("name", node.name);
    }
  };

  const handleClick = (event) => {
    if (node.teamId !== projectId) {
      event.preventDefault();
      handleDialogOpen();
    } else {
      sessionStorage.setItem("fromLink", `true`);
      sessionStorage.setItem("name", node.name);
    }
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          minWidth: 200,
          maxHeight: 120,
          borderRadius: 1.5,
          textAlign: "left",
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
          textTransform: "capitalize",
          ...sx,
        }}
      >
        <Stack direction={"row"}>
          {node.icon ? (
            <Iconify
              sx={{
                mr: 2,
                mb: 1,
                width: 48,
                height: 48,
                color: "info.main",
              }}
              icon={node.icon.replace(/^:|:$/g, "")}
            />
          ) : (
            <SourcedAvatar
              name={node.name}
              source={"MINIMAL"}
              avatarUrl={node.avatar ? node.avatar : null}
              sx={{ mr: 2, mb: 1, width: 48, height: 48 }}
            >
              {null}
            </SourcedAvatar>
          )}

          <Stack>
            <Typography variant="subtitle2" noWrap>
              {node.name}
            </Typography>
            <Typography
              variant="caption"
              component="div"
              noWrap
              sx={{ color: "text.secondary" }}
            >
              {node.coach ? node.coach : node.role}
            </Typography>
          </Stack>
          {!node.icon && (
            <Link
              data-cy="chat-link"
              onClick={handleClick}
              to="/chat"
              state={{
                fromLink: true,
                name: node.name,
              }}
              style={{ position: "absolute", top: 0, right: 0, color: "white" }}
            >
              <Iconify icon="fluent:chat-16-regular" />
            </Link>
          )}
        </Stack>

        <Dialog open={open} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change team?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleDialogClose(true)}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
}

export default StandardNode;
