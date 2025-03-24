import FlowReact from "../../components/SideChat/Flow";
import SideChat from "../../components/SideChat/SideChat";
import useResponsibility from "../../hooks/useResponsibility";

import { Box, Button, Card, Drawer, Grid } from "@mui/material";
import React, { useState } from "react";

function Responsibility() {
  const { responsibility } = useResponsibility();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDrawerOpen = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ mt: 2 }}>
          {responsibility.map((item) => (
            <Card key={item.id} sx={{ width: "60%", margin: "0 auto", mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
                  position: "relative",
                  gap: 1,
                  borderRadius: 5,
                  padding: 3,
                  height: 250,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  <Box sx={{ fontWeight: "bold" }}>Responsibility:</Box>
                  <Box>{item.responsibilities}</Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                  }}
                  onClick={() => handleDrawerOpen(item)}
                >
                  Action
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
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
          {selectedItem && (
            <Grid container sx={{ flex: 1 }} spacing={2}>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    borderRight: "1px solid #ccc",
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
                    <SideChat />
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    flex: 1,
                    padding: 2,
                    overflowY: "auto",
                  }}
                >
                  <Box>
                    <FlowReact />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Responsibility;
