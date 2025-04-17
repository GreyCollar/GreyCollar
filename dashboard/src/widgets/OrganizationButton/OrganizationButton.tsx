import { IconButton } from "@mui/material";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import OrganizationChart from "../OrganizationChart/OrganizationChart";
import { useState } from "react";

function OrganizationButton() {
  const [open, setOpen] = useState(false);
  console.log("Organization Button");
  return (
    <>
      <IconButton
        data-cy="organization-button"
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.text.primary,
        }}
        onClick={() => setOpen(!open)}
      >
        <Iconify icon={"ri:node-tree"} width={24} />
      </IconButton>
      <OrganizationChart open={open} setOpen={setOpen} />
    </>
  );
}

export default OrganizationButton;
