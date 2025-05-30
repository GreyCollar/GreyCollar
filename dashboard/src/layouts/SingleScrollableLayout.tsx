import React from "react";

import { Box, Grid, Typography } from "@mui/material";

function SingleScorllableLayout({ title, children }) {
  return (
    <>
      <Typography sx={{ textAlign: "center", fontSize: "3rem", marginTop: 4 }}>
        {title}
      </Typography>
      <Box sx={{ paddingX: 10 }}>
        <Grid container spacing={4}>
          {children}
        </Grid>
      </Box>
    </>
  );
}

export default SingleScorllableLayout;
