import Card from "@mui/material/Card";
import { Iconify } from "@canmingir/link/minimal/components";
import { Image } from "@canmingir/link/minimal/components";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import { getBackgroundUrl } from "../../../utils/background";

import { Chip, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const animatedBgClassName = "animated-background-image";

function ColleagueNode({
  node,
  sx,
}: {
  node: {
    id: string;
    name: string;
    avatar?: string;
    icon?: string;
    coach?: string;
    role?: string;
    engine?: { vendor?: string };
  };
  sx?: React.CSSProperties;
}) {
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          p: 0,
          minWidth: 350,
          maxWidth: 450,
          height: 120,
          borderRadius: 1.5,
          textAlign: "left",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          boxShadow: (theme) => theme.shadows[3],
          "&:hover": {
            boxShadow: (theme) => theme.shadows[6],
          },
          overflow: "hidden",
          [`&:hover .${animatedBgClassName}`]: {
            width: "100%",
          },
          ...sx,
          ml: 1,
        }}
      >
        <Image
          className={animatedBgClassName}
          src={getBackgroundUrl(node?.id)}
          alt={node?.engine?.vendor || "Background"}
          ratio="16/9"
          sx={{
            width: 100,
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
          }}
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />

        <Stack
          direction="column"
          spacing={8}
          sx={{
            width: 100,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px 0 0 8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SourcedAvatar
            name={node.name}
            source={node.coach ? node.icon : "MINIMAL"}
            avatarUrl={node.avatar}
            sx={{ width: 48, height: 48, zIndex: 1 }}
          />
        </Stack>

        <Stack
          direction="column"
          spacing={1}
          sx={{
            flex: 1,
            padding: 2,
            zIndex: 1,
            position: "relative",
          }}
        >
          <Stack
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            sx={{ mt: 1 }}
            alignItems={"center"}
          >
            <Chip
              label={node.name}
              icon={<Iconify icon="mingcute:location-fill" width={24} />}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
                cursor: "pointer",
                "& .MuiChip-icon": {
                  color: "white",
                },
                "&:hover": {
                  color: theme.palette.background.paper,
                  "& .MuiChip-icon": {
                    color: theme.palette.background.paper,
                  },
                },
              }}
            />
          </Stack>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            sx={{ mt: 1 }}
            alignItems={"center"}
          >
            <Chip
              label={node.role}
              icon={<Iconify icon="ic:round-business-center" width={24} />}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
                cursor: "pointer",
                "& .MuiChip-icon": {
                  color: "white",
                },
                "&:hover": {
                  color: theme.palette.background.paper,
                  "& .MuiChip-icon": {
                    color: theme.palette.background.paper,
                  },
                },
              }}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

export default ColleagueNode;
