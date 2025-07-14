import Card from "@mui/material/Card";
import { Iconify } from "@canmingir/link/minimal/components";
import React from "react";
import Typography from "@mui/material/Typography";

import { Box, Chip, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

function TeamNode({
  node,
  sx,
}: {
  node: {
    id: string;
    name: string;
    avatar?: string;
    icon?: string;
    coach?: string;
    role?: string;
    engine?: { vendor?: string };
  };
  sx?: React.CSSProperties;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2,
        minWidth: 200,
        maxWidth: 420,
        height: 140,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        ...sx,
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
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          zIndex: 0,
        }}
      />

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Iconify
            sx={{
              mr: 2,
              mb: 1,
              width: 36,
              height: 36,
              color: "info.main",
            }}
            icon={node.icon.replace(/^:|:$/g, "")}
          />
          <Chip
            label={`Team Leader: ${node.coach}`}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              "&:hover": {
                color: theme.palette.background.paper,
              },
            }}
          />
        </Stack>

        <Stack spacing={1} alignItems="center">
          <Typography
            sx={{
              color: "text.primary",
              fontWeight: "bold",
              lineHeight: 1.2,
            }}
          >
            {node.name}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default TeamNode;
