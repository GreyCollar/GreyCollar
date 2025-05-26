import { Icon } from "@iconify/react";
import React from "react";

import { Box, Card, Typography, useTheme } from "@mui/material";

const CommunicationResponsibilitySelection = ({
  responsibilities,
  selectedRights,
  onRightsChange,
  responsibilityIcon,
}: {
  responsibilities: Array<{
    id: string;
    title: string;
    icon?: string;
  }>;
  selectedRights: string[];
  onRightsChange: (rights: string[]) => void;
  responsibilityIcon?: string;
}) => {
  const theme = useTheme();

  return (
    <>
      {(responsibilities || []).map((resp) => {
        const checked = selectedRights.includes(resp.id);
        return (
          <Card
            key={resp.id}
            onClick={() => {
              if (checked) {
                onRightsChange(selectedRights.filter((id) => id !== resp.id));
              } else {
                onRightsChange([...selectedRights, resp.id]);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              cursor: "pointer",
              border: checked
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
            }}
          >
            <Icon
              icon={resp.icon || responsibilityIcon}
              width="24"
              height="24"
            />
            <Typography flexGrow={1}>{resp.title}</Typography>
            <Box
              component="span"
              sx={{
                color: checked
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled,
              }}
            >
              {checked ? "✓" : ""}
            </Box>
          </Card>
        );
      })}
    </>
  );
};

export default CommunicationResponsibilitySelection;
