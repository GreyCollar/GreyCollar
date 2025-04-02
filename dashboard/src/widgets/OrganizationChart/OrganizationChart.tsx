import OrganizationalChart from "./Content";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";

function OrganizationChart({ open, setOpen }) {
  const Content = () => {
    console.log("Organization Chart");
    return (
      <DialogContent sx={{ margin: 5 }} data-cy="organization-chart">
        <DialogTitle variant="h4">Organizational Chart</DialogTitle>

        <OrganizationalChart
          sx={{ margin: 0.2, lineHeight: "15px" }}
          variant="standard"
        />
      </DialogContent>
    );
  };

  return (
    <>
      <Dialog maxWidth={"xl"} open={open} onClose={() => setOpen(false)}>
        {Content()}
      </Dialog>
    </>
  );
}
export default OrganizationChart;
