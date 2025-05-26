import ColleagueNode from "./common/ColleagueNode";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import React from "react";
import ResponsibilityNode from "./common/ResponsibilityNode";
import TeamNode from "./common/TeamNode";

import { Box, Fab, Stack } from "@mui/material";

function TeamWithColleagues({
  data,
  sx,
  allResponsibilities,
  teamRefs,
  colleagueRefs,
  responsibilityRefs,
  onAddColleague,
}: {
  data: {
    id: string;
    name: string;
    colleagues?: Array<{
      id: string;
      name: string;
      responsibilities?: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>;
    responsibilities?: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  };
  sx?: React.CSSProperties;
  allResponsibilities?: {
    id: string;
    title: string;
    colleagueId: string;
  }[];
  teamRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  colleagueRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  responsibilityRefs: React.MutableRefObject<
    Record<string, HTMLDivElement | null>
  >;
  onAddColleague: () => void;
}) {
  return (
    <Stack alignItems="center" spacing={8}>
      <Box position="relative">
        <Box
          ref={(el: HTMLDivElement | null) => (teamRefs.current[data.id] = el)}
        >
          <TeamNode node={data} sx={sx} />
        </Box>

        <Fab
          color="default"
          aria-label="add colleague"
          size="small"
          onClick={onAddColleague}
          sx={{
            width: 32,
            height: 32,
            minHeight: "auto",
            boxShadow: 2,
            position: "absolute",
            top: "50%",
            right: -40,
            transform: "translateY(-50%)",
          }}
        >
          <Iconify icon="ri:user-add-line" />
        </Fab>
      </Box>

      {data.colleagues && data.colleagues.length > 0 && (
        <Stack direction="row" spacing={5} justifyContent="center">
          {data.colleagues.map((colleague) => {
            const colleagueResponsibilities =
              allResponsibilities?.filter(
                (resp) => resp.colleagueId === colleague.id
              ) || [];

            return (
              <Stack key={colleague.id || colleague.name} alignItems="center">
                <Box
                  ref={(el: HTMLDivElement | null) =>
                    (colleagueRefs.current[
                      `${data.id}-${colleague.id || colleague.name}`
                    ] = el)
                  }
                >
                  <ColleagueNode sx={sx} node={colleague} />
                </Box>

                {colleagueResponsibilities.length > 0 && (
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 6 }}
                  >
                    {colleagueResponsibilities.map((responsibility, index) => (
                      <Box
                        key={`resp-${index}-${
                          responsibility.id || responsibility.title
                        }`}
                        ref={(el: HTMLDivElement | null) =>
                          (responsibilityRefs.current[
                            `${data.id}-${colleague.id}-responsibility-${index}`
                          ] = el)
                        }
                      >
                        <ResponsibilityNode
                          responsibility={responsibility}
                          sx={sx}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default TeamWithColleagues;
