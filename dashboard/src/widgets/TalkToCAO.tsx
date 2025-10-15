import { Label } from "@canmingir/link/platform/components";
import React from "react";

import { Avatar, Box } from "@mui/material";

export default function TalkToCAO() {
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={
            "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg"
          }
          sx={{
            display: "flex",
            alignSelf: "center",
            mx: "auto",
            width: { xs: 24, md: 45 },
            height: { xs: 24, md: 45 },
            border: `solid 2px ${(theme) => theme.palette.common.white}`,
          }}
        />
        <Label
          color="primary"
          variant="filled"
          sx={{
            m: 1,
            top: -18,
            px: 0.5,
            left: 30,
            height: 20,
            position: "absolute",
            borderBottomLeftRadius: 2,
          }}
        >
          Talk to CAO
        </Label>
      </Box>
    </>
  );
}
