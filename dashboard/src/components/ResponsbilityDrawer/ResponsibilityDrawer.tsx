import CloseIcon from "@mui/icons-material/Close";
import ResponsibilityChat from "../ResponsibilityChat/ResponsibilityChat";
import ResponsibilityChatTitle from "../ResponsibilityChat/ResponsibilityChatTitle";
import ResponsibilityFlow from "../ResponsibilityFlow/ResponsibilityFlow";

import {
  Box,
  Drawer,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

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

  const [title, setTitle] = useState(selectedItem?.title);
  const [description, setDescription] = useState(selectedItem?.description);
  const [createResponsibilityHandler, setCreateResponsibilityHandler] =
    useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setTitle(selectedItem?.title);
    setDescription(selectedItem?.description);
  }, [selectedItem]);

  const handleTitleChange = useCallback((newTitle) => {
    setTitle(newTitle);
  }, []);

  const handleDescriptionChange = useCallback((newDescription) => {
    setDescription(newDescription);
  }, []);

  const handleCreateResponsibility = useCallback((handler) => {
    setCreateResponsibilityHandler(() => handler);
  }, []);

  const handleMessagesChange = useCallback((newMessages) => {
    setMessages(newMessages);
  }, []);

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

        <Grid container sx={{ flex: 1, height: "100%" }} spacing={getSpacing()}>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            lg={7}
            xl={7}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "100vh",
            }}
          >
            <Box
              sx={{
                flex: 1,
                padding: {
                  xs: 1,
                  sm: 1.5,
                  md: 2,
                },
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
              }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <ResponsibilityChatTitle
                  title={title}
                  description={description}
                  messages={messages}
                  handleCreateResponsibility={createResponsibilityHandler}
                  setTitle={setTitle}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
                <ResponsibilityFlow
                  responsibility={selectedItem}
                  aiResponse={aiResponse}
                  chatVisible={true}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: "100%",
              maxHeight: "100vh",
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderLeft: {
                  xs: "none",
                  sm: "none",
                  md: `2px solid ${theme.palette.divider}`,
                },
                borderTop: {
                  xs: `2px solid ${theme.palette.divider}`,
                  sm: "2px solid ${theme.palette.divider}",
                  md: "none",
                },
                padding: {
                  xs: 1,
                  sm: 1.5,
                  md: 2,
                },
                height: "100%",
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <ResponsibilityChat
                  selectedItem={selectedItem}
                  setAiResponse={setAiResponse}
                  aiResponse={aiResponse}
                  setSelectedItem={setSelectedItem}
                  onTitleChange={handleTitleChange}
                  onDescriptionChange={handleDescriptionChange}
                  onCreateResponsibility={handleCreateResponsibility}
                  onMessagesChange={handleMessagesChange}
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
