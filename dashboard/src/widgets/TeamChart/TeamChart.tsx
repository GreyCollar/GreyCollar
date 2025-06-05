import ColleagueWizard from "../ColleagueWizard/ColleagueWizard";
import Draggable from "react-draggable"; // Add this import
import ManagerNode from "./common/ManagerNode";
import ResponsibilityDrawer from "../../components/ResponsbilityDrawer/ResponsibilityDrawer";
import TeamWithColleagues from "./TeamWithColleagues";
import { storage } from "@nucleoidjs/webstorage";
import useColleagues from "../../hooks/useColleagues";
import useOrganizations from "../../hooks/useOrganziationsV2";
import useResponsibility from "../../hooks/useResponsibility";
import useTeam from "../../hooks/useTeam";
import { useTheme } from "@mui/material/styles";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function TeamChart({ sx }) {
  const theme = useTheme();
  const managerRef = useRef(null);
  const teamRefs = useRef({});
  const colleagueRefs = useRef({});
  const responsibilityRefs = useRef({});
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  const manager = {
    name: "Jack Shepherd",
    role: "CAO - Chief AI Officer",
    avatar: ":5:",
    id: "manager-root",
  };

  const projectId = storage.get("projectId");
  const { teamById } = useTeam(projectId);
  const organizationId = teamById?.organizationId;

  const { organization, loading } =
    useOrganizations().getOrganizationById(organizationId);

  const { createColleague } = useColleagues();

  const { getResponsibility } = useResponsibility();
  const { responsibility: allResponsibilities } = getResponsibility();

  const filteredOrganizations = organization
    ? organization.filter(
        (org) =>
          org.colleagues && org.colleagues.length > 0 && org.id === projectId
      )
    : [];

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddColleague = (teamId) => {
    setSelectedTeamId(teamId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTeamId(null);
  };

  const handleDrawerOpen = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const checkContentSize = () => {
    if (!containerRef.current || !viewportRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportRect = viewportRef.current.getBoundingClientRect();

    const contentWidth = containerRect.width;
    const contentHeight = containerRect.height;

    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;

    const exceedsWidth = contentWidth > viewportWidth;
    const exceedsHeight = contentHeight > viewportHeight;

    setIsDraggable(exceedsWidth || exceedsHeight);

    if (exceedsWidth || exceedsHeight) {
      const horizontalBound = exceedsWidth
        ? ((contentWidth - viewportWidth) / 2) * 1.5
        : 0;

      const verticalBound = exceedsHeight
        ? ((contentHeight - viewportHeight) / 2) * 1.5
        : 0;

      setBounds({
        left: -horizontalBound,
        right: horizontalBound,
        top: -verticalBound,
        bottom: verticalBound,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(
    () => {
      const containerNode = containerRef.current;
      const updateConnections = () => {
        if (!managerRef.current || !containerNode) return;

        const containerRect = containerNode.getBoundingClientRect();
        const managerRect = managerRef.current.getBoundingClientRect();

        const managerCenterX =
          managerRect.left + managerRect.width / 2 - containerRect.left;
        const managerBottomY = managerRect.bottom - containerRect.top;

        const newConnections = [];

        filteredOrganizations.forEach((org) => {
          const teamRef = teamRefs.current[org.id];
          if (teamRef) {
            const teamRect = teamRef.getBoundingClientRect();
            const teamCenterX =
              teamRect.left + teamRect.width / 2 - containerRect.left;
            const teamTopY = teamRect.top - containerRect.top;

            newConnections.push({
              type: "manager-team",
              path: `
              M ${managerCenterX} ${managerBottomY}
              L ${managerCenterX} ${
                managerBottomY + (teamTopY - managerBottomY) / 2
              }
              L ${teamCenterX} ${
                managerBottomY + (teamTopY - managerBottomY) / 2
              }
              L ${teamCenterX} ${teamTopY}
            `,
            });

            if (org.colleagues && org.colleagues.length > 0) {
              org.colleagues.forEach((colleague) => {
                const colleagueKey = `${org.id}-${
                  colleague.id || colleague.name
                }`;
                const colleagueRef = colleagueRefs.current[colleagueKey];

                if (colleagueRef) {
                  const colleagueRect = colleagueRef.getBoundingClientRect();
                  const colleagueCenterX =
                    colleagueRect.left +
                    colleagueRect.width / 2 -
                    containerRect.left;
                  const colleagueTopY = colleagueRect.top - containerRect.top;
                  const colleagueBottomY =
                    colleagueRect.bottom - containerRect.top;

                  newConnections.push({
                    type: "team-colleague",
                    path: `
                    M ${teamCenterX} ${teamRect.bottom - containerRect.top}
                    L ${teamCenterX} ${
                      teamRect.bottom -
                      containerRect.top +
                      (colleagueTopY - (teamRect.bottom - containerRect.top)) /
                        2
                    }
                    L ${colleagueCenterX} ${
                      teamRect.bottom -
                      containerRect.top +
                      (colleagueTopY - (teamRect.bottom - containerRect.top)) /
                        2
                    }
                    L ${colleagueCenterX} ${colleagueTopY}
                  `,
                  });

                  const responsibilities = allResponsibilities?.filter(
                    (resp) => resp.colleagueId === colleague.id
                  );

                  if (responsibilities && responsibilities.length > 0) {
                    const respKey = `${org.id}-${colleague.id}-responsibility-0`;
                    const respRef = responsibilityRefs.current[respKey];

                    if (respRef) {
                      const respRect = respRef.getBoundingClientRect();
                      const respCenterX =
                        respRect.left + respRect.width / 2 - containerRect.left;
                      const respTopY = respRect.top - containerRect.top;

                      newConnections.push({
                        type: "colleague-responsibility",
                        path: `
                        M ${colleagueCenterX} ${colleagueBottomY}
                        L ${colleagueCenterX} ${
                          colleagueBottomY + (respTopY - colleagueBottomY) / 2
                        }
                        L ${respCenterX} ${
                          colleagueBottomY + (respTopY - colleagueBottomY) / 2
                        }
                        L ${respCenterX} ${respTopY}
                      `,
                      });
                    }
                  }
                }
              });
            }
          }
        });

        setConnections(newConnections);

        checkContentSize();
      };

      const handleResize = () => {
        requestAnimationFrame(() => {
          updateConnections();
          checkContentSize();
        });
      };

      const resizeObserver = new ResizeObserver(handleResize);

      if (containerNode) {
        resizeObserver.observe(containerNode);
      }

      if (viewportRef.current) {
        resizeObserver.observe(viewportRef.current);
      }

      window.addEventListener("resize", handleResize);

      const timeoutId = setTimeout(() => {
        updateConnections();
        checkContentSize();
      }, 200);

      return () => {
        if (containerNode) {
          resizeObserver.unobserve(containerNode);
        }
        if (viewportRef.current) {
          resizeObserver.unobserve(viewportRef.current);
        }
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filteredOrganizations), JSON.stringify(allResponsibilities)]
  );

  useEffect(
    () => {
      if (containerRef.current) {
        const timeoutId = setTimeout(() => {
          checkContentSize();
        }, 50);
        return () => clearTimeout(timeoutId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(position)]
  );

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
        <CircularProgress />
      </Stack>
    );
  }

  const dotColor =
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.15)";
  const dotSize = "1px";
  const dotSpacing = "20px";

  const lineColor =
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.3)";
  const lineWidth = 2;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}, transparent ${dotSize})`,
        backgroundSize: `${dotSpacing} ${dotSpacing}`,
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        ref={viewportRef}
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Draggable
          nodeRef={containerRef}
          onDrag={handleDrag}
          position={position}
          axis="both"
          bounds={bounds}
          disabled={!isDraggable}
        >
          <Box
            ref={containerRef}
            sx={{
              padding: theme.spacing(4),
              cursor: isDraggable ? "move" : "default",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={lineColor} />
                </marker>
              </defs>

              {connections.map((conn, index) => (
                <path
                  key={index}
                  d={conn.path}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  markerEnd={
                    conn.type === "manager-team" ||
                    conn.type === "team-colleague" ||
                    conn.type === "colleague-responsibility"
                      ? "url(#arrow)"
                      : "none"
                  }
                />
              ))}
            </svg>

            {dialogOpen && (
              <ColleagueWizard
                open={dialogOpen}
                onClose={handleCloseDialog}
                itemProperties={["name", "character", "role"]}
                onSubmit={(newColleague) => {
                  createColleague(newColleague, selectedTeamId);
                }}
                itemToEdit={null}
              />
            )}

            {drawerOpen && (
              <ResponsibilityDrawer
                drawerOpen={drawerOpen}
                handleDrawerClose={() => setDrawerOpen(false)}
                selectedItem={selectedItem}
              />
            )}

            {filteredOrganizations.length > 0 ? (
              <Stack
                alignItems="center"
                spacing={8}
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Box ref={managerRef}>
                  <ManagerNode sx={sx} node={manager} />
                </Box>

                <Stack direction="row" spacing={8} justifyContent="center">
                  {filteredOrganizations.map((org) => (
                    <TeamWithColleagues
                      key={org.id}
                      data={org}
                      sx={sx}
                      allResponsibilities={allResponsibilities}
                      teamRefs={teamRefs}
                      colleagueRefs={colleagueRefs}
                      responsibilityRefs={responsibilityRefs}
                      onAddColleague={() => handleAddColleague(org.id)}
                      handleDrawerOpen={handleDrawerOpen}
                    />
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Typography align="center">
                No organization data to display.
              </Typography>
            )}
          </Box>
        </Draggable>
      </Box>
    </Box>
  );
}

export default TeamChart;
