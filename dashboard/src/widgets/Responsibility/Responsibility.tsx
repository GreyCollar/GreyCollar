import ResponsibilityCard from "../../components/ResponsibilityCard/ResponsibilityCard";
import ResponsibilityDrawer from "../../components/ResponsbilityDrawer/ResponsibilityDrawer";
import ResponsibilityFlowDialog from "../../components/ReactFlow/ResponsibilityFlowDialog";
import useResponsibility from "../../hooks/useResponsibility";

import { Box, Container } from "@mui/material";
import React, { useState } from "react";

function Responsibility() {
  const { responsibility } = useResponsibility();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);

  const handleDrawerOpen = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const handleAiResponse = (response) => {
    setAiResponse(response);
  };

  const handleFlowDialogOpen = (item) => {
    setSelectedItem(item);
    setFlowDialogOpen(true);
  };

  const handleFlowDialogClose = () => {
    setFlowDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ mt: 2 }}>
          {responsibility.map((item) => (
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
        handleAiResponse={handleAiResponse}
        aiResponse={aiResponse}
      />
      <ResponsibilityFlowDialog
        flowDialogOpen={flowDialogOpen}
        handleFlowDialogClose={handleFlowDialogClose}
        selectedItem={selectedItem}
        aiResponse={aiResponse}
      />
    </Container>
  );
}

export default Responsibility;
