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
          maxWidth: 310,
          height: 80,
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
            width: 45,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.primary.light,
            borderRadius: "8px 0 0 8px",
            padding: 1,
          }}
        >
          <Fab
            color="default"
            size="small"
            sx={{
              width: 32,
              height: 32,
              minHeight: "auto",
              boxShadow: 2,
            }}
          >
            <Iconify icon="logos:slack-icon" />
          </Fab>
          <Fab
            color="default"
            size="small"
            sx={{
              width: 32,
              height: 32,
              minHeight: "auto",
              boxShadow: 2,
            }}
          >
            <Iconify icon="logos:whatsapp-icon" />
          </Fab>
        </Stack>

        <Stack
          direction="column"
          spacing={1}
          sx={{
            flex: 1,
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
