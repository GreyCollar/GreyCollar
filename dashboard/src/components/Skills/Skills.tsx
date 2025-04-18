import { Icon } from "@iconify/react";
import React from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";

const Skills = ({ title, description, logo, onSkillClick, acquired }) => {
  return (
    <Card
      sx={{
        height: 270,
        width: "100%",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
      }}
      onClick={() => onSkillClick({ title, description, logo, acquired })}
    >
      {acquired && (
        <Icon
          icon="mdi:check-circle"
          color="green"
          width={30}
          height={30}
          style={{ position: "absolute", top: 8, right: 8 }}
        />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Icon icon={logo} width="30" height="30" />
      </Box>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {title
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default Skills;
