import SourcedAvatar from "../../components/SourcedAvatar/SourcedAvatar";
import StandardNode from "./common/standard-node";
import { storage } from "@nucleoidjs/webstorage";
import useOrganizations from "../../hooks/useOrganziationsV2";
import useTeam from "../../hooks/useTeam";
import { useTheme } from "@mui/material/styles";

import { Card, CircularProgress, Stack, Typography } from "@mui/material";
import { Tree, TreeNode } from "react-organizational-chart";

function OrganizationalChart({ variant = "simple", sx }) {
  const theme = useTheme();

  const manager = {
    name: "Jack Shephard",
    role: "CAO - Chief AI Officer",
    avatar: ":5:",
  };

  const projectId = storage.get("projectId");

  const { teamById } = useTeam(projectId);

  const organizationId = teamById?.organizationId;

  const { organization, loading, error } =
    useOrganizations().getOrganizationById(organizationId);

  const filteredOrganizations = organization
    ? organization.filter((org) => org.colleagues && org.colleagues.length > 0)
    : [];

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading organization: {error}
      </Typography>
    );
  }

  return (
    <Tree
      lineWidth="1.5px"
      nodePadding="4px"
      lineBorderRadius="24px"
      lineColor={theme.palette.divider}
      label={
        variant === "standard" &&
        manager && <ManagerNode sx={sx} node={manager} />
      }
    >
      <TreeNode label={<div />}>
        {filteredOrganizations.map((rootNode, index) => (
          <TreeNode
            key={index}
            label={
              variant === "standard" && <StandardNode sx={sx} node={rootNode} />
            }
          >
            {rootNode.colleagues &&
              rootNode.colleagues.map((colleague) => (
                <List
                  key={colleague.name}
                  depth={1}
                  data={colleague}
                  variant={variant}
                  sx={sx}
                />
              ))}
          </TreeNode>
        ))}
      </TreeNode>
    </Tree>
  );
}

export default OrganizationalChart;

// ----------------------------------------------------------------------

function ManagerNode({ node, sx }) {
  return (
    <Card
      sx={{
        p: 1,
        minWidth: 200,
        maxHeight: 120,
        borderRadius: 1.5,
        textAlign: "left",
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        textTransform: "capitalize",
        ...sx,
      }}
    >
      <Stack direction={"row"}>
        <SourcedAvatar
          name={node.name}
          source={node.coach ? node.icon : "MINIMAL"}
          avatarUrl={node.avatar}
          sx={{ mr: 2, mb: 1, width: 48, height: 48 }}
        />
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {node.name}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            noWrap
            sx={{ color: "text.secondary" }}
          >
            {node.coach ? node.coach : node.role}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

function List({ data, depth, variant, sx }) {
  return (
    <TreeNode
      label={variant === "standard" && <StandardNode sx={sx} node={data} />}
    >
      {data.colleagues && data.colleagues.length > 0 && (
        <SubList
          data={data.colleagues}
          depth={depth}
          variant={variant}
          sx={sx}
        />
      )}
    </TreeNode>
  );
}

// ----------------------------------------------------------------------

function SubList({ data, depth, variant, sx }) {
  return (
    <>
      {data.map((list) => (
        <List
          key={list.name}
          data={list}
          depth={depth + 1}
          variant={variant}
          sx={sx}
        />
      ))}
    </>
  );
}
