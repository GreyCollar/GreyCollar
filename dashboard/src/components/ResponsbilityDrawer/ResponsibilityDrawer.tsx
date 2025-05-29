import React from "react";
import ResponsibilityChat from "../ResponsibilityChat/ResponsibilityChat";
import ResponsibilityFlow from "../ResponsibilityFlow/ResponsibilityFlow";

import { Box, Drawer, Grid, useTheme } from "@mui/material";

const ResponsibilityDrawer = ({
  drawerOpen,
  handleDrawerClose,
  selectedItem,
  setAiResponse,
  aiResponse,
  setSelectedItem,
}) => {
  const theme = useTheme();

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
      <Box
        sx={{
          width: 1200,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Grid container sx={{ flex: 1 }} spacing={2}>
          <Grid
            item
            xs={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRight: `1px solid ${theme.palette.divider}`,
                padding: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <ResponsibilityChat
                  selectedItem={selectedItem}
                  setAiResponse={setAiResponse}
                  aiResponse={aiResponse}
                  setSelectedItem={setSelectedItem}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={7} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                flex: 1,
                padding: 2,
                overflowY: "auto",
              }}
            >
              <Box>
                <ResponsibilityFlow
                  responsibility={selectedItem}
                  aiResponse={aiResponse}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default ResponsibilityDrawer;
