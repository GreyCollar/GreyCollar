import AddNewButton from "../../components/AddNewButton";
import Box from "@mui/material/Box";
import ColleagueCard from "../../components/ColleagueCard";
import ColleagueSkeleton from "../../components/Skeletons/ColleagueSkeleton";
import ColleagueWizard from "../ColleagueWizard/ColleagueWizard";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { Grid } from "@mui/material";
import { publish } from "@nucleoidai/react-event";
import useColleague from "../../hooks/useColleague";
import useColleagues from "../../hooks/useColleagues";
import { useNavigate } from "react-router-dom";
import useTeams from "../../hooks/useTeams";
import useUIState from "../../hooks/useUIState";

import React, { useState } from "react";

function ColleaguesWidget({ teamId, colleagueId }) {
  const [updatedColleague, setUpdatedColleague] = useState(null);
  const [deleteFunction, setDeleteFunction] = useState(null);
  const navigate = useNavigate();
  const { uiState, openForm, closeForm, openDialog, closeDialog } =
    useUIState();

  const { deleteTeam } = useTeams();
  const { colleagues, loading, deleteColleague, createColleague } =
    useColleagues();

  const { updateColleague } = useColleague(colleagueId);

  function deleteTeams() {
    //dispatch({ type: "TEAM_DELETE" });
    navigate("/teams");
  }

  const handleColleagueClick = (colleagueid) => {
    navigate(`/colleagues/${colleagueid}`);
  };

  return (
    <>
      <Box
        gap={3}
        data-cy={"service-card"}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        sx={{
          "@media (max-width:600px)": {
            position: "relative",
            left: "50%",
            transform: "translateX(-40%)",
          },
        }}
      >
        <AddNewButton
          type={"wideButton"}
          addNew={"Colleague"}
          onClickFunction={() => {
            openForm();
            publish("COLLEAGUE_WIZARD_OPENED", { type: "ADD" });
          }}
        />

        {loading
          ? Array.from({ length: 1 }).map((_, index) => (
              <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                <ColleagueSkeleton key={index} />
              </Grid>
            ))
          : colleagues.map((colleague) => (
              <ColleagueCard
                key={colleague.id}
                colleague={colleague}
                onView={() => handleColleagueClick(colleague.id)}
                onDelete={() => {
                  setDeleteFunction(() => () => deleteColleague(colleague.id));
                  openDialog();
                }}
                onEdit={() => {
                  setUpdatedColleague(colleague);
                  openForm();
                }}
              />
            ))}
      </Box>
      <Grid container justifyContent="center" mt={0} spacing={2}>
        <ColleagueWizard
          open={uiState.formOpen}
          onClose={() => {
            closeForm();
            setUpdatedColleague(null);
          }}
          itemProperties={["name", "character", "role"]}
          onSubmit={updatedColleague ? updateColleague : createColleague}
          itemToEdit={updatedColleague}
        />
        <ConfirmationDialog
          open={uiState.dialogOpen}
          onClose={closeDialog}
          onConfirm={() => {
            deleteFunction();
            closeDialog();
          }}
          title="Delete Confirmation"
          content="Are you sure you want to delete this item?"
        />
        <DeleteButton
          onClickFunction={() => (
            setDeleteFunction(() => async () => {
              await deleteTeam(teamId);
              deleteTeams();
            }),
            openDialog()
          )}
        />
      </Grid>
    </>
  );
}

export default ColleaguesWidget;
