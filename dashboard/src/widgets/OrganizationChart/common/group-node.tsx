import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Label } from "@canmingir/link/platform/components";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function GroupNode({ node, depth, length, sx }) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === "light";

  const styles = (color) => ({
    bgcolor: alpha(theme.palette[color].main, 0.08),
    border: `solid 1px ${alpha(theme.palette[color].main, 0.24)}`,
    color: lightMode
      ? theme.palette[color].darker
      : theme.palette[color].lighter,
  });

  const isLabel = depth === 1;

  const isGrRoot = node.group === "root";

  const isGrProduct = node.group === "product design";

  const isGrDevelopment = node.group === "development";

  const isGrMarketing = node.group === "marketing";

  return (
    <Stack
      sx={{ position: "relative", display: "inline-flex" }}
      alignItems="center"
    >
      {!isLabel && (
        <Avatar
          alt={node.name}
          src={node.avatarUrl || ""}
          sx={{
            mt: -3.5,
            zIndex: 9,
            width: 56,
            height: 56,
            position: "absolute",
            border: `solid 4px ${theme.palette.background.paper}`,
          }}
        />
      )}

      <Card
        sx={{
          pt: 5,
          pb: 3,
          minWidth: 200,
          borderRadius: 1.5,
          textTransform: "capitalize",
          ...(isLabel && { py: 2 }),
          ...(isLabel && isGrProduct && styles("primary")),
          ...(isLabel && isGrDevelopment && styles("info")),
          ...(isLabel && isGrMarketing && styles("warning")),
          ...sx,
        }}
      >
        {depth !== 1 && !isGrRoot && (
          <Box
            sx={{
              top: 0,
              left: 0,
              width: 1,
              height: 4,
              position: "absolute",
              borderRadius: 1.5,
              ...(isGrProduct && {
                bgcolor: "primary.light",
              }),
              ...(isGrDevelopment && {
                bgcolor: "info.light",
              }),
              ...(isGrMarketing && {
                bgcolor: "warning.light",
              }),
            }}
          />
        )}

        <Typography variant={isLabel ? "subtitle1" : "subtitle2"} noWrap>
          {node.name}
          {isLabel && (
            <Label
              color={
                (isGrDevelopment && "info") ||
                (isGrMarketing && "warning") ||
                "primary"
              }
              sx={{ ml: 1 }}
            >
              {length}
            </Label>
          )}
        </Typography>

        {!isLabel && (
          <Typography
            variant="caption"
            component="div"
            noWrap
            sx={{ color: "text.secondary" }}
          >
            {node.role}
          </Typography>
        )}
      </Card>
    </Stack>
  );
}
