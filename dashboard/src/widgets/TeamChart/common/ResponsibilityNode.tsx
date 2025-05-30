import { Iconify } from "@nucleoidai/platform/minimal/components";
import React from "react";
import { useTheme } from "@mui/material/styles";

import { Box, Card, Fab, Stack, Typography } from "@mui/material";

function ResponsibilityNode({
  responsibility,
  sx,
}: {
  responsibility: {
    id: string;
    title: string;
    description?: string;
  };
  sx?: React.CSSProperties;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: "pointer",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          minWidth: 200,
          maxWidth: 290,
          height: 100,
          borderRadius: 1.5,
          boxShadow: 3,
          "&:hover": {
            boxShadow: 6,
          },
          ...sx,
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          sx={{
            position: "relative",
            width: 65,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.primary.light,
            borderRadius: "8px 0 0 8px",
            padding: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "100%",
              width: "100%",
            }}
          >
            {["logos:slack-icon", "logos:whatsapp-icon"].map((icon, index) => (
              <Fab
                key={icon}
                color="default"
                size="small"
                sx={{
                  width: 26,
                  height: 26,
                  minHeight: "auto",
                  boxShadow: 2,
                  position: "absolute",
                  top: index * 20,
                  left: 0,
                }}
              >
                <Iconify icon={icon} />
              </Fab>
            ))}
          </Box>
        </Stack>

        <Stack
          direction="column"
          spacing={1}
          sx={{
            padding: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: theme.palette.primary.dark,
            }}
          >
            {responsibility.title}
          </Typography>
          {responsibility.description && (
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {responsibility.description}
            </Typography>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

export default ResponsibilityNode;
