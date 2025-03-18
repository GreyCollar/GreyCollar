import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export default function WidgetSummary({
  title,
  percent,
  total,
  chart,
  sx,
  ...other
}) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Iconify
            width={24}
            icon={
              percent < 0
                ? "solar:double-alt-arrow-down-bold-duotone"
                : "solar:double-alt-arrow-up-bold-duotone"
            }
            sx={{
              mr: 1,
              color: "success.main",
              ...(percent < 0 && {
                color: "error.main",
              }),
            }}
          />

          <Typography component="div" variant="subtitle2">
            {percent > 0 && "+"}

            {percent}
          </Typography>
        </Stack>

        <Typography variant="h3">{total}</Typography>
      </Box>

      {chart}
    </Card>
  );
}
