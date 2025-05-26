import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";

import { Card, Stack, Typography } from "@mui/material";

function ManagerNode({ node, sx }) {
  return (
    <Stack direction={"row"} alignItems={"center"}>
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
          <SourcedAvatar
            name={node.name}
            source={"MINIMAL"}
            avatarUrl={node.avatar}
            sx={{ mr: 2, mb: 1, width: 48, height: 48 }}
          />
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
              {node.role}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export default ManagerNode;
