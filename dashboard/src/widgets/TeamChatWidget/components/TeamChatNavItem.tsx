import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Stack from "@mui/material/Stack";

function TeamChatNavItem({ member, selected, collapse, onClick }) {
  const { name, avatar, role } = member;

  const handleClickMember = () => {
    onClick(member);
  };

  return (
    <>
      {!collapse && (
        <ListItemButton
          disableGutters
          onClick={handleClickMember}
          sx={{
            py: 1.5,
            px: 2.5,
            ...(selected && {
              bgcolor: "action.selected",
            }),
          }}
        >
          <SourcedAvatar
            name={name}
            source={"MINIMAL"}
            avatarUrl={avatar}
            sx={{ width: 36, height: 36 }}
          />
          <ListItemText
            sx={{ ml: 2 }}
            primary={name}
            primaryTypographyProps={{
              noWrap: true,
              variant: "subtitle2",
            }}
            secondary={role}
            secondaryTypographyProps={{
              noWrap: true,
              component: "span",
              variant: "body2",
              color: "text.secondary",
            }}
          />
          <Stack alignItems="flex-end" sx={{ ml: 1, height: 44 }}></Stack>
        </ListItemButton>
      )}
    </>
  );
}
export default TeamChatNavItem;
