import AddIcon from "@mui/icons-material/Add";
import ResponsibilityCard from "../../components/ResponsibilityCard/ResponsibilityCard";
import ResponsibilityDrawer from "../../components/ResponsbilityDrawer/ResponsibilityDrawer";
import ResponsibilityFlowDialog from "../../components/ResponsibilityFlow/ResponsibilityFlowDialog";
import { Theme } from "@mui/material/styles";
import { useEvent } from "@nucleoidai/react-event";
import useResponsibility from "../../hooks/useResponsibility";

import { Box, Container, Fab, Stack, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

function ResponsibilitiesWidget() {
  const [responsibilityUpsertedEvent] = useEvent("RESPONSIBILITY_UPSERTED", {
    responsibility: null,
  });
  const [responsibilityRemovedEvent] = useEvent("RESPONSIBILITY_REMOVED", {
    responsibility: null,
  });

  const { getResponsibility, removeResponsibility } = useResponsibility();

  const { responsibility } = getResponsibility([
    responsibilityUpsertedEvent.responsibility,
    responsibilityRemovedEvent.responsibility,
  ]);

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
              removeResponsibility={removeResponsibility}
              colleagueId={item.colleagueId}
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
        setSelectedItem={setSelectedItem}
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
