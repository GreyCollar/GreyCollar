import { Iconify } from "@canmingir/link/minimal/components";
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
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            boxShadow: 6,
            "& .animated-background-selector": {
              width: "100%",
              borderRadius: 1.5,
            },
            "& .responsibility-title, & .responsibility-description": {
              color: theme.palette.getContrastText(theme.palette.primary.light),
            },
          },
          ...sx,
        }}
      >
        <Box
          className="animated-background-selector"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 65,
            backgroundColor: theme.palette.primary.light,
            borderRadius: "8px 0 0 8px",
            transition: theme.transitions.create(["width", "border-radius"], {
              duration: theme.transitions.duration.short,
            }),
            zIndex: 0,
          }}
        />
        <Stack
          direction="column"
          spacing={1}
          sx={{
            position: "relative",
            zIndex: 1,
            width: 65,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            className="responsibility-title"
            sx={{
              color: theme.palette.primary.dark,
              transition: theme.transitions.create("color", {
                duration: theme.transitions.duration.short,
              }),
            }}
          >
            {responsibility.title}
          </Typography>
          {responsibility.description && (
            <Typography
              variant="caption"
              component="div"
              className="responsibility-description"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                transition: theme.transitions.create("color", {
                  duration: theme.transitions.duration.short,
                }),
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
