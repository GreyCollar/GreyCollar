import { IconButton } from "@mui/material";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function OrganizationButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
    navigate("/organizations");
  };

  return (
    <>
      <IconButton
        data-cy="organization-button"
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.text.primary,
        }}
        onClick={handleClick}
      >
        <Iconify icon={"ri:node-tree"} width={24} />
      </IconButton>
    </>
  );
}

export default OrganizationButton;
