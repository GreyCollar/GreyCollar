import Box from "@mui/material/Box";
import StatusToolbar from "../../components/StatusToolbar/StatusToolbar";
import SupervisingCard from "../../components/SupervisingCard/SupervisingCard";
import { useState } from "react";
import useSupervisings from "../../hooks/useSupervisingsV2";

import { Container, Skeleton, Stack } from "@mui/material";

const Supervising = ({ colleagueId }) => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const { getColleagueSupervisingByStatus } = useSupervisings();

  const { supervisings, loading } = getColleagueSupervisingByStatus(
    colleagueId,
    selectedStatus
  );

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <StatusToolbar
          statuses={["All", "ANSWERED", "IN_PROGRESS"]}
          handleChange={handleChange}
          selectedStatus={selectedStatus}
        />
        {loading ? (
          <Stack
            spacing={2}
            sx={{ textAlign: "center", p: 2, color: "text.secondary" }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                height={180}
                sx={{
                  borderRadius: 2,
                }}
              />
            ))}
          </Stack>
        ) : supervisings.length > 0 ? (
          supervisings.map((supervise) => (
            <SupervisingCard key={supervise.id} supervise={supervise} />
          ))
        ) : (
          <Stack sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
            No supervising data available for the selected status
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default Supervising;
