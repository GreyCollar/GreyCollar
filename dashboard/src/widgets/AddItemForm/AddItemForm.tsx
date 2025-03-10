import AppsIcon from "@mui/icons-material/Apps";
import ColleagueAndTeamAvatars from "../../lib/ColleagueAndTeamAvatars";
import Picker from "@emoji-mart/react";
import styles from "./styles";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

function NewItemForm({
  title,
  itemProperties,
  onSubmit,
  open,
  onClose,
  itemToEdit,
}) {
  const [newItem, setNewItem] = useState(
    itemProperties.reduce((obj, property) => ({ ...obj, [property]: "" }), {})
  );
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setNewItem(itemToEdit);
    } else if (!open) {
      setNewItem(
        itemProperties.reduce(
          (obj, property) => ({ ...obj, [property]: "" }),
          {}
        )
      );
    }
  }, [open, itemProperties, itemToEdit]);

  const handleSave = () => {
    if (newItem.id) {
      const { id, ...rest } = newItem;
      onSubmit(id, rest);
    } else {
      onSubmit(newItem);
    }
    onClose();
  };

  const handleEmojiButtonClick = () => {
    setEmojiDialogOpen(true);
  };

  const handleEmojiSelect = (emoji) => {
    setNewItem((prevItem) => {
      return {
        ...prevItem,
        icon: `:${emoji.id}:`,
        src: `${emoji.src}`,
      };
    });
    setEmojiDialogOpen(false);
  };
  const handleInputChange = (property) => (event) => {
    setNewItem({ ...newItem, [property]: event.target.value });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "25px" } }}
    >
      <DialogTitle sx={styles.dialogTitle}>Add a new {title}</DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {itemProperties.map((property) =>
          property === "icon" ? (
            <div key={property}>
              <Typography sx={styles.iconTitle}>{property}</Typography>
              <Divider sx={styles.iconDivider} />
              <Box sx={styles.iconBox}>
                <Box sx={styles.iconPreview}>
                  {newItem.src && (
                    <Box
                      component={"img"}
                      src={newItem?.src}
                      sx={{
                        mx: "auto",
                        width: { xs: 64, md: 128 },
                        height: { xs: 64, md: 128 },
                        borderStyle: "none",
                      }}
                    />
                  )}
                </Box>
                <Button
                  onClick={handleEmojiButtonClick}
                  variant="contained"
                  color="secondary"
                  sx={styles.iconButton}
                >
                  <AppsIcon />
                  Pick Icon
                </Button>
                <Dialog open={emojiDialogOpen}>
                  <Picker
                    onEmojiSelect={handleEmojiSelect}
                    custom={ColleagueAndTeamAvatars}
                    categories={"team_icons"}
                    emojiButtonSize={90}
                    emojiSize={75}
                    perLine={4}
                    previewPosition={"none"}
                    searchPosition={"none"}
                    theme={"dark"}
                  />
                </Dialog>
              </Box>
            </div>
          ) : (
            <TextField
              inputProps={{
                "data-cy": property,
              }}
              key={property}
              autoFocus
              margin="dense"
              label={property}
              fullWidth
              value={newItem[property] || ""}
              onChange={handleInputChange(property)}
              InputLabelProps={{ sx: { color: "primary.main" } }}
              sx={{ mt: "1rem", textTransform: "capitalize" }}
            />
          )
        )}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          data-cy="save-button"
          onClick={handleSave}
          variant="contained"
          color={"secondary"}
          sx={styles.saveButton}
        >
          Save
        </Button>
        <Button onClick={onClose} sx={styles.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewItemForm;
