import { IconButton } from "@mui/material";
import { Iconify } from "@canmingir/link/platform/components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { alpha, useTheme } from "@mui/material/styles";

function OrganizationButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
    navigate("/team");
  };

  const theme = useTheme();

  return (
    <>
      <IconButton
        data-cy="organization-button"
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.secondary.light,
            0.2
          )}, ${alpha(theme.palette.primary.main, 0.5)})`,
          color: (theme) => theme.palette.text.primary,
        }}
        onClick={handleClick}
      >
        <Iconify icon={"ri:node-tree"} width={28} />
      </IconButton>
    </>
  );
}

export default OrganizationButton;
