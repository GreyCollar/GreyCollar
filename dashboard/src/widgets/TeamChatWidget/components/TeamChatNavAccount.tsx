import { ListItemText } from "@mui/material";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import useTeamDetails from "../../../hooks/useTeamDetails";

function TeamChatNavAccount() {
  const { teamDetails } = useTeamDetails();

  return (
    <>
      <SourcedAvatar
        name={"Nucleous Nucleotide avatar"}
        sx={{ cursor: "pointer", width: 48, height: 48, ml: 2 }}
        source={"MINIMAL"}
        avatarUrl={teamDetails.coachAvatar}
      />
      <ListItemText
        sx={{ ml: 2 }}
        primary={teamDetails.coach}
        primaryTypographyProps={{
          noWrap: true,
          variant: "subtitle2",
        }}
        secondary={"Team Leader"}
        secondaryTypographyProps={{
          noWrap: true,
          component: "span",
          variant: "body2",
          color: "text.secondary",
        }}
      />
    </>
  );
}

export default TeamChatNavAccount;
