import { Iconify } from "@canmingir/link/platform/components";
import styles from "../styles";

import { Box, IconButton } from "@mui/material";
import React, { memo } from "react";

const Head = memo(
  ({
    title,
    mute,
    changeMute,
    handleClose,
    readOnly,
  }: {
    title: string;
    mute: boolean;
    changeMute: () => void;
    handleClose: () => void;
    readOnly: boolean;
  }) => (
    <Box sx={styles.header}>
      <Box sx={{ marginRight: "auto", color: "white" }}>{title}</Box>
      {!readOnly && (
        <IconButton onClick={changeMute} className="noDrag">
          <Iconify
            icon={
              mute
                ? "solar:volume-cross-bold-duotone"
                : "solar:volume-loud-bold-duotone"
            }
            sx={{ width: 22, height: 22 }}
          />
        </IconButton>
      )}
      <IconButton onClick={handleClose} className="noDrag">
        <Iconify
          icon="solar:close-circle-line-duotone"
          sx={{ width: 26, height: 26 }}
        />
      </IconButton>
    </Box>
  )
);

export { Head };
