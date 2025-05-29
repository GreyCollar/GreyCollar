import Card from "@mui/material/Card";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import { Image } from "@nucleoidai/platform/minimal/components";
import ListAltIcon from "@mui/icons-material/ListAlt";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Typography from "@mui/material/Typography";
import { getBackgroundUrl } from "../../../utils/background";

import { IconButton, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

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
          maxWidth: 400,
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
          ...sx,
          ml: 1,
        }}
      >
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
            overflow: "hidden",
          }}
        >
          <Image
            src={getBackgroundUrl(node?.id)}
            alt={node?.engine?.vendor || "Background"}
            ratio="16/9"
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
            overlay={alpha(theme.palette.grey[900], 0.48)}
          />
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
          }}
        >
          <Stack
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            sx={{ mt: 1 }}
            alignItems={"center"}
          >
            <Iconify icon="mingcute:location-fill" width={24} />
            <Typography
              variant="caption"
              component="div"
              noWrap
              sx={{
                color: "text.secondary",
              }}
            >
              {node.name}
            </Typography>
          </Stack>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            sx={{ mt: 1 }}
            alignItems={"center"}
          >
            <Iconify icon="ic:round-business-center" width={24} />
            <Typography
              variant="caption"
              component="div"
              noWrap
              sx={{
                color: "text.secondary",
              }}
            >
              {node.role}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

export default ColleagueNode;
