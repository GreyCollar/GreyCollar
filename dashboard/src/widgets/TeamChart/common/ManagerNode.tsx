import { Iconify } from "@nucleoidai/platform/minimal/components";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";

import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

function ManagerNode({
  node,
  sx,
}: {
  node: {
    name: string;
    role?: string;
    avatar?: string;
  };
  sx?: React.CSSProperties;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2.5,
        width: 230,
        height: 120,
        borderRadius: 2,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
          "&:before": {
            height: "100%",
          },
        },
        "&:before": {
          content: '""',
          width: "100%",
          height: "40%",
          position: "absolute",
          top: 0,
          left: 0,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.secondary.light,
            0.2
          )}, ${alpha(theme.palette.primary.main, 0.3)})`,
          borderRadius: "8px 8px 0 0",
          transition: "height 0.3s ease-in-out",
        },
        ...sx,
      }}
    >
      <Stack
        spacing={1}
        sx={{
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <SourcedAvatar
            name={node.name}
            source="MINIMAL"
            avatarUrl={node.avatar}
            sx={{
              width: 36,
              height: 36,
              border: `3px solid ${theme.palette.background.paper}`,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          />
          <Chip
            label={node.role}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "white",
              fontWeight: "bold",
              fontSize: "0.75rem",
              cursor: "pointer",
              "&:hover": {
                color: theme.palette.background.paper,
              },
            }}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 600 }}>{node.name}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default ManagerNode;
