import Card from "@mui/material/Card";
import { Image } from "@nucleoidai/platform/minimal/components";
import React from "react";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { getBackgroundUrl } from "../../../utils/background";

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
          minWidth: 300,
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
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: (theme) => theme.palette.primary.dark,
            }}
          >
            {node.name}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            noWrap
            sx={{
              color: "text.secondary",
            }}
          >
            {node.coach ? node.coach : node.role}
          </Typography>
        </Stack>
      </Card>
    </>
  );
}

export default ColleagueNode;
