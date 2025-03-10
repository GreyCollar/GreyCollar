import AddIcon from "@mui/icons-material/Add";
import ColleagueAndTeamAvatars from "../../lib/ColleagueAndTeamAvatars";
import IconButton from "@mui/material/IconButton";
import Picker from "@emoji-mart/react";
import React from "react";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";

import { Dialog, Stack } from "@mui/material";

export default function AvatarSelector({
  handleEmojiSelect,
  avatarSrc,
  avatar,
}) {
  const [emojiDialogOpen, setEmojiDialogOpen] = React.useState(false);
  const handleEmojiButtonClick = () => {
    setEmojiDialogOpen(true);
  };
  return (
    <Stack alignContent={"center"} justifyContent={"center"}>
      <Stack>
        <IconButton
          data-cy="avatar-select-button"
          onClick={handleEmojiButtonClick}
          sx={{
            borderStyle: `dashed`,
            borderColor: "gray",
            borderWidth: "2px",
            mx: "auto",
            width: { xs: 77, md: 140 },
            height: { xs: 77, md: 140 },
          }}
        >
          <SourcedAvatar
            name={avatar}
            source={`https://cdn.nucleoid.com/greycollar/avatars/${avatar?.replace(
              /:/g,
              ""
            )}.jpg`}
            avatarUrl={`https://cdn.nucleoid.com/greycollar/avatars/${avatar?.replace(
              /:/g,
              ""
            )}.jpg`}
            sx={{
              display: "flex",
              alignSelf: "center",
              mx: "auto",
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${(theme) => theme.palette.common.white}`,
            }}
          >
            <AddIcon fontSize="large" />
          </SourcedAvatar>
        </IconButton>
      </Stack>
      <Dialog
        data-cy="avatar-selection"
        open={emojiDialogOpen}
        onClose={() => setEmojiDialogOpen(false)}
      >
        <Picker
          onEmojiSelect={(emoji) => {
            handleEmojiSelect(emoji), setEmojiDialogOpen(false);
          }}
          custom={ColleagueAndTeamAvatars}
          categories={["colleague_avatars"]}
          searchPosition={"none"}
          navPosition="none"
          emojiButtonSize={90}
          emojiSize={75}
          perLine={4}
          autoFocus="true"
          previewPosition={"none"}
          theme={"dark"}
        />
      </Dialog>
    </Stack>
  );
}
