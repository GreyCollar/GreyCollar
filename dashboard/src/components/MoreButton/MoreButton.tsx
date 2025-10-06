import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import {
  CustomPopover,
  Iconify,
  usePopover,
} from "@canmingir/link/platform/components";

function MoreVertButton({ handleEdit, handleDelete, isEditable }) {
  const popover = usePopover();

  return (
    <>
      <IconButton data-cy="knowledge-edit" onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
        data-cy="more-vert-popover"
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleEdit();
          }}
          disabled={!isEditable}
        >
          <Iconify data-cy="edit-button" icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            popover.onClose();
            handleDelete();
          }}
        >
          <Iconify data-cy="delete-button" icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

export default MoreVertButton;
