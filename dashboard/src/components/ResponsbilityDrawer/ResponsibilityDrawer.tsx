import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import ResponsibilityChat from "../ResponsibilityChat/ResponsibilityChat";
import ResponsibilityFlow from "../ResponsibilityFlow/ResponsibilityFlow";

import {
  Box,
  Drawer,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ResponsibilityDrawer = ({
  drawerOpen,
  handleDrawerClose,
  selectedItem,
  setAiResponse,
  aiResponse,
  setSelectedItem,
}: {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  selectedItem: {
    id: string;
    title: string;
    description: string;
    colleagueId: string;
  };
  handleAiResponse?: (response) => void;
  aiResponse?: string;
  setAiResponse?: (response: string) => void;
  setSelectedItem?: (item: {
    id: string;
    title: string;
    description: string;
    colleagueId: string;
  }) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const getDrawerWidth = () => {
    if (isMobile) return "100vw";
    if (isTablet) return "90vw";
    return Math.min(1200, window.innerWidth * 0.8);
  };

  const getSpacing = () => {
    if (isMobile) return 1;
    if (isTablet) return 1.5;
    return 2;
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
      <Box
        sx={{
          width: getDrawerWidth(),
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        role="presentation"
      >
        {(isMobile || isTablet) && (
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1000,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
              "&:hover": {
                backgroundColor: theme.palette.grey[100],
              },
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        )}

        <Grid container sx={{ flex: 1 }} spacing={getSpacing()}>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            xl={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRight: {
                  xs: "none",
                  sm: "none",
                  md: `1px solid ${theme.palette.divider}`,
                },
                borderBottom: {
                  xs: `1px solid ${theme.palette.divider}`,
                  sm: `1px solid ${theme.palette.divider}`,
                  md: "none",
                },
                padding: {
                  xs: 1,
                  sm: 1.5,
                  md: 2,
                },
                minHeight: {
                  xs: "50vh",
                  sm: "50vh",
                  md: "auto",
                },
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
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            xl={4}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                flex: 1,
                padding: {
                  xs: 1,
                  sm: 1.5,
                  md: 2,
                },
                overflowY: "auto",
                minHeight: {
                  xs: "40vh",
                  sm: "40vh",
                  md: "auto",
                },
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
