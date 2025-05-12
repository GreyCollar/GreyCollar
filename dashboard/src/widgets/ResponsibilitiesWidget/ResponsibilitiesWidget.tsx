import AddIcon from "@mui/icons-material/Add";
import ResponsibilityCard from "../../components/ResponsibilityCard/ResponsibilityCard";
import ResponsibilityDrawer from "../../components/ResponsbilityDrawer/ResponsibilityDrawer";
import ResponsibilityFlowDialog from "../../components/ResponsibilityFlow/ResponsibilityFlowDialog";
import { Theme } from "@mui/material/styles";
import useResponsibility from "../../hooks/useResponsibility";

import { Box, Container, Fab, Stack, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

function ResponsibilitiesWidget() {
  const { getResponsibility } = useResponsibility();
  const { responsibility } = getResponsibility();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);

  const handleDrawerOpen = (item) => {
    item === null
      ? setSelectedItem({ id: "test", title: "", description: "" })
      : setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const handleFlowDialogOpen = (item) => {
    setSelectedItem(item);
    setFlowDialogOpen(true);
  };

  const handleFlowDialogClose = () => {
    setFlowDialogOpen(false);
    setSelectedItem(null);
  };

  const lgScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  console.log("Responsibility AI response:", aiResponse);

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ mt: 2 }}>
          {responsibility?.map((item) => (
            <ResponsibilityCard
              key={item.id}
              item={item}
              handleDrawerOpen={handleDrawerOpen}
              handleFlowDialogOpen={handleFlowDialogOpen}
            />
          ))}
        </Box>
      </Box>
      <ResponsibilityDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedItem={selectedItem}
        setAiResponse={setAiResponse}
        aiResponse={aiResponse}
      />
      <ResponsibilityFlowDialog
        flowDialogOpen={flowDialogOpen}
        handleFlowDialogClose={handleFlowDialogClose}
        selectedItem={selectedItem}
        aiResponse={aiResponse}
      />

      <Stack
        sx={{
          position: lgScreen ? "absolute" : "fixed",
          bottom: lgScreen ? -60 : 10,
          right: lgScreen ? 0 : 5,
        }}
      >
        <Fab
          color="default"
          size="medium"
          sx={{ mt: 2, zIndex: 0 }}
          onClick={() => handleDrawerOpen(null)}
        >
          <AddIcon />
        </Fab>
      </Stack>
    </Container>
  );
}

export default ResponsibilitiesWidget;
