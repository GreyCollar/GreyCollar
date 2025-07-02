import { Icon } from "@iconify/react";
import React from "react";

import { Card, Radio, Typography, useTheme } from "@mui/material";

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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select one responsibility to connect to the channel:
      </Typography>
      {(responsibilities || []).map((resp) => {
        const checked = selectedRights.includes(resp.id);
        return (
          <Card
            key={resp.id}
            onClick={() => {
              onRightsChange([resp.id]);
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
              backgroundColor: checked
                ? theme.palette.primary.light + "20"
                : "transparent",
              transition: theme.transitions.create([
                "border-color",
                "background-color",
              ]),
              "&:hover": {
                backgroundColor: checked
                  ? theme.palette.primary.light + "30"
                  : theme.palette.action.hover,
              },
            }}
          >
            <Radio
              checked={checked}
              onChange={() => {
                onRightsChange([resp.id]);
              }}
              value={resp.id}
              name="responsibility-selection"
              color="primary"
              sx={{ p: 0 }}
            />
            <Icon
              icon={resp.icon || responsibilityIcon}
              width="24"
              height="24"
            />
            <Typography flexGrow={1}>{resp.title}</Typography>
          </Card>
        );
      })}
      {selectedRights.length > 0 && (
        <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
          Selected:{" "}
          {responsibilities.find((r) => r.id === selectedRights[0])?.title}
        </Typography>
      )}
    </>
  );
};

export default CommunicationResponsibilitySelection;
