import { Iconify } from "@canmingir/link/minimal/components";
import { Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { memo } from "react";

const LoadingMessage = memo(() => (
  <Stack
    sx={{
      p: 2,
      height: 50,
      backgroundColor: (theme) => alpha(theme.palette.primary.dark, 0.5),
      borderRadius: 1,
      mt: 1,
    }}
  >
    <Iconify icon="svg-spinners:tadpole" sx={{ width: 25, height: 25 }} />
  </Stack>
));

export { LoadingMessage };
