import Card from "@mui/material/Card";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import { useTheme } from "@mui/material/styles";

import { Stack, Typography } from "@mui/material";

// ----------------------------------------------------------------------

function TeamNode({
  node,
  sx,
}: {
  node: {
    id: string;
    name: string;
    icon?: string;
  };
  sx?: React.CSSProperties;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 450,
        minHeight: 100,
        maxHeight: 250,
        borderRadius: "12px",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
        overflow: "hidden",
        ...sx,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{
          flex: 1,
          p: 2,
          textAlign: "center",
        }}
      >
        <Iconify
          sx={{
            mr: 2,
            mb: 1,
            width: 48,
            height: 48,
            color: "info.main",
          }}
          icon={node.icon.replace(/^:|:$/g, "")}
        />
        <Typography
          variant="subtitle1"
          noWrap
          sx={{
            fontWeight: "fontWeightBold",
            color: theme.palette.text.primary,
          }}
        >
          {node.name}
        </Typography>
      </Stack>
    </Card>
  );
}

export default TeamNode;
