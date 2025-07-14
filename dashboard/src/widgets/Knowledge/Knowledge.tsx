import AddIcon from "@mui/icons-material/Add";
import AddItemDialog from "../../components/AddItemDialog/AddItemDialog";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";
import KnowledgeTable from "../../components/KnowledgeTable/KnowledgeTable";
import { Theme } from "@mui/material/styles";
import TypeToolbar from "../../components/TypeToolbar/TypeToolbar";
import useColleague from "../../hooks/useColleagueV2";
import useKnowledge from "../../hooks/useKnowledge";
import useOrganizations from "../../hooks/useOrganziationsV2";
import { useTable } from "@canmingir/link/minimal/components";
import useTeams from "../../hooks/useTeamsV2";

import { Box, Container, Fab, Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

function Knowledge({
  colleagueId,
  teamId,
}: {
  colleagueId?: string;
  teamId?: string;
}) {
  const {
    getColleagueKnowledges,
    deleteKnowledge,
    createKnowledge,
    getTeamKnowledges,
  } = useKnowledge();

  const { knowledges } = getColleagueKnowledges(colleagueId);
  const { knowledges: teamKnowledges } = getTeamKnowledges(teamId);

  const { getTeamById } = useTeams();

  const { team } = getTeamById(teamId);

  const { getOrganizations } = useOrganizations();

  const { organizations: filteredOrganizations, loading: organizationLoading } =
    getOrganizations();

  const { getColleagues } = useColleague();
  const { colleagues } = getColleagues();

  const table = useTable();

  const ALL_KNOWLEDGE_TYPES = ["ALL", "URL", "TEXT", "QA"].sort((a, b) => {
    if (a === "ALL") return -1;
    if (b === "ALL") return 1;
    if (a === "URL") return -1;
    if (b === "URL") return 1;
    return 0;
  });

  const lgScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  const ADD_ITEM_TYPES = ALL_KNOWLEDGE_TYPES.filter((type) => type !== "ALL");

  const [selectedType, setSelectedType] = useState(ALL_KNOWLEDGE_TYPES[0]);

  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const filteredKnowledges =
    selectedType === "ALL"
      ? colleagueId
        ? knowledges
        : teamKnowledges
      : (colleagueId ? knowledges : teamKnowledges).filter(
          (knowledge) => knowledge && knowledge.type === selectedType
        );

  const handleChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (item) => {
    if (item) {
      const deleteResponse = await deleteKnowledge(item);
      if (deleteResponse) {
        knowledges.filter((knowledge) => knowledge.id !== item.id);
      }
    }
  };

  useEffect(() => {
    if (
      !ALL_KNOWLEDGE_TYPES.includes(selectedType) &&
      ALL_KNOWLEDGE_TYPES.length > 0
    ) {
      setSelectedType(ALL_KNOWLEDGE_TYPES[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  return (
    <>
      <Container>
        <TypeToolbar
          types={ALL_KNOWLEDGE_TYPES}
          selectedType={selectedType}
          handleChange={handleChange}
        />

        <Box
          sx={{
            position: "relative",
          }}
        >
          {filteredKnowledges?.length > 0 ? (
            <KnowledgeTable
              table={table}
              selectedType={selectedType}
              knowledges={filteredKnowledges}
              handleDeleteClick={handleDeleteClick}
            />
          ) : (
            <Stack sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
              No data available for {selectedType} type
            </Stack>
          )}

          <Stack
            sx={{
              position: lgScreen ? "absolute" : "fixed",
              bottom: lgScreen ? -60 : 10,
              right: lgScreen ? 0 : 5,
            }}
          >
            <Fab
              variant="button"
              color="default"
              size="medium"
              sx={{ mt: 2, zIndex: 0 }}
              data-cy="add-knowledge-button"
              onClick={() => {
                setOpen(true);
              }}
            >
              <AddIcon />
            </Fab>
          </Stack>
        </Box>

        <DeleteConfirmation
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleDelete={handleDelete}
          selectedItem={selectedItem}
        />
        {!organizationLoading ? (
          <AddItemDialog
            types={ADD_ITEM_TYPES}
            selectedType={selectedType === "ALL" ? "URL" : selectedType}
            setSelectedType={setSelectedType}
            open={open}
            setOpen={setOpen}
            addItem={createKnowledge}
            colleagueId={colleagueId}
            teamId={teamId}
            teamById={team}
            colleagues={colleagues}
            organizations={filteredOrganizations}
          />
        ) : null}
      </Container>
    </>
  );
}
export default Knowledge;
