import { IconButton } from "@mui/material";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import OrganizationChart from "../widgets/OrganizationChart/OrganizationChart";
import TeamChart from "../widgets/TeamChart/TeamChart";

import { Box, Button } from "@mui/material";
import React, { useState } from "react";

const Organizations = () => {
  const [isOldChartOpen, setIsOldChartOpen] = useState(false);

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Box sx={{ position: "absolute", top: 16, right: 100, zIndex: 10 }}>
          <IconButton
            data-cy="organization-button"
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.text.primary,
            }}
            onClick={() => setIsOldChartOpen(!isOldChartOpen)}
          >
            <Iconify icon={"ri:node-tree"} width={24} />
          </IconButton>
        </Box>
        <TeamChart sx={{ margin: 0.2, lineHeight: "15px" }} />
      </Box>
      <OrganizationChart open={isOldChartOpen} setOpen={setIsOldChartOpen} />
    </>
  );
};

export default Organizations;
