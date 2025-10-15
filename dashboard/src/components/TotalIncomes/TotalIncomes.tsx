import Box from "@mui/material/Box";
import { Iconify } from "@canmingir/link/platform/components";
import React from "react";
import Stack from "@mui/material/Stack";

import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function TotalIncomes({
  title,
  total,
  percent,
  color = "primary",
  chart,
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        direction: "135deg",
        startColor: alpha(theme.palette[color].light, 0.2),
        endColor: alpha(theme.palette[color].main, 0.2),
        p: 3,
        borderRadius: 2,
        color: `${color}.darker`,
        backgroundColor: "common.white",
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Box sx={{ mb: 1, typography: "subtitle2" }}>{title}</Box>
          <Box sx={{ typography: "h3" }}>{total}</Box>
        </div>

        <div>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Iconify
              icon={
                percent >= 0 ? "eva:trending-up-fill" : "eva:trending-down-fill"
              }
            />

            <Box sx={{ typography: "subtitle2" }}>
              {percent > 0 && "+"}
              {percent}
            </Box>
          </Stack>

          <Box sx={{ mt: 0.5, opacity: 0.8, typography: "body2" }}>
            than last month{" "}
          </Box>
        </div>
      </Stack>
      {chart}
    </Stack>
  );
}
