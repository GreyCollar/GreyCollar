import AddCircleIcon from "@mui/icons-material/AddCircle";
import Stack from "@mui/material/Stack";
import styles from "./styles";

import { Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function AddNewButton({ type, addNew, onClickFunction }) {
  const [size, setSize] = useState({
    width: "",
    height: "",
    borderRadius: "",
    minWidth: "",
    maxHeight: "",
  });

  useEffect(() => {
    switch (type) {
      case "largeButton":
        setSize(styles.largeButton);

        break;
      case "wideButton":
        setSize(styles.wideButton);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card
        data-cy="add-new-button"
        onClick={onClickFunction}
        sx={{
          ...styles.default,
          width: { xs: "300px", sm: size.width },
          height: { xs: "250px", sm: size.height },
          borderRadius: size.borderRadius,
          minWidth: size.minWidth,
          maxHeight: size.maxHeight,
        }}
      >
        <Stack direction="column" alignItems="center">
          <AddCircleIcon fontSize="large" />
          <Typography color={"inherit"} variant="subtitle1" margin={0.5}>
            Add New {addNew}
          </Typography>
        </Stack>
      </Card>
    </>
  );
}

export default AddNewButton;
