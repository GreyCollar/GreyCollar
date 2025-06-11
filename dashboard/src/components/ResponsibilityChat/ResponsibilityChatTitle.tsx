import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import { ResponsibilityCommands } from "../ChatInput/chat.config";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  IntegrationElement,
  IntegrationScopeElement,
} from "./IntegrationElement";
import React, { useState } from "react";

const ResponsibilityChatTitle = ({
  title,
  description,
  messages,
  handleCreateResponsibility,
  setTitle,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    handleCreateResponsibility(title, description);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const renderDescriptionContent = () => {
    if (!description) return null;

    try {
      const availableIntegrations = ResponsibilityCommands[0]?.next?.list || [];
      const availableScopes = [];

      availableIntegrations.forEach((integration) => {
        if (integration.next?.list) {
          integration.next.list.forEach((scope) => {
            availableScopes.push({
              ...scope,
              parentIntegration: integration,
            });
          });
        }
      });

      const matches = [];
      let modifiedDescription = description;

      availableIntegrations.forEach((integration) => {
        const regex = new RegExp(`\\b${integration.name}\\b`, "gi");
        const integrationMatches = modifiedDescription.match(regex);
        if (integrationMatches) {
          integrationMatches.forEach((match) => {
            matches.push({
              text: match,
              type: "integration",
              data: integration,
              index: modifiedDescription
                .toLowerCase()
                .indexOf(match.toLowerCase()),
            });
          });
        }
      });

      availableScopes.forEach((scope) => {
        const regex = new RegExp(`\\b${scope.name}\\b`, "gi");
        const scopeMatches = modifiedDescription.match(regex);
        if (scopeMatches) {
          scopeMatches.forEach((match) => {
            matches.push({
              text: match,
              type: "scope",
              data: scope,
              index: modifiedDescription
                .toLowerCase()
                .indexOf(match.toLowerCase()),
            });
          });
        }
      });

      if (matches.length > 0) {
        matches.sort((a, b) => a.index - b.index);

        const parts = [];
        let lastIndex = 0;

        matches.forEach((match, i) => {
          const currentIndex = modifiedDescription
            .toLowerCase()
            .indexOf(match.text.toLowerCase(), lastIndex);

          if (currentIndex > lastIndex) {
            parts.push(modifiedDescription.substring(lastIndex, currentIndex));
          }

          parts.push(match);

          lastIndex = currentIndex + match.text.length;
        });

        if (lastIndex < modifiedDescription.length) {
          parts.push(modifiedDescription.substring(lastIndex));
        }

        return (
          <>
            {parts.map((part, index) => {
              if (typeof part === "object" && part.type === "integration") {
                return (
                  <IntegrationElement key={`desc-integration-${index}`}>
                    <Iconify icon={part.data.icon} sx={{ mr: 1 }} />
                    {part.data.name}
                  </IntegrationElement>
                );
              } else if (typeof part === "object" && part.type === "scope") {
                return (
                  <IntegrationScopeElement key={`desc-scope-${index}`}>
                    <Iconify icon={part.data.icon} />
                    {part.data.name}
                  </IntegrationScopeElement>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </>
        );
      }

      return description;
    } catch (error) {
      console.error("Error processing description content:", error);
      return description;
    }
  };

  const renderTitleContent = () => {
    if (!title) return "Add Title";

    try {
      const availableIntegrations = ResponsibilityCommands[0]?.next?.list || [];
      const availableScopes = [];

      availableIntegrations.forEach((integration) => {
        if (integration.next?.list) {
          integration.next.list.forEach((scope) => {
            availableScopes.push({
              ...scope,
              parentIntegration: integration,
            });
          });
        }
      });

      const matches = [];
      let modifiedTitle = title;

      availableIntegrations.forEach((integration) => {
        const regex = new RegExp(`\\b${integration.name}\\b`, "gi");
        const integrationMatches = modifiedTitle.match(regex);
        if (integrationMatches) {
          integrationMatches.forEach((match) => {
            matches.push({
              text: match,
              type: "integration",
              data: integration,
              index: modifiedTitle.toLowerCase().indexOf(match.toLowerCase()),
            });
          });
        }
      });

      availableScopes.forEach((scope) => {
        const regex = new RegExp(`\\b${scope.name}\\b`, "gi");
        const scopeMatches = modifiedTitle.match(regex);
        if (scopeMatches) {
          scopeMatches.forEach((match) => {
            matches.push({
              text: match,
              type: "scope",
              data: scope,
              index: modifiedTitle.toLowerCase().indexOf(match.toLowerCase()),
            });
          });
        }
      });

      if (matches.length > 0) {
        matches.sort((a, b) => a.index - b.index);

        const parts = [];
        let lastIndex = 0;

        matches.forEach((match, i) => {
          const currentIndex = modifiedTitle
            .toLowerCase()
            .indexOf(match.text.toLowerCase(), lastIndex);

          if (currentIndex > lastIndex) {
            parts.push(modifiedTitle.substring(lastIndex, currentIndex));
          }

          parts.push(match);

          lastIndex = currentIndex + match.text.length;
        });

        if (lastIndex < modifiedTitle.length) {
          parts.push(modifiedTitle.substring(lastIndex));
        }

        return (
          <>
            {parts.map((part, index) => {
              if (typeof part === "object" && part.type === "integration") {
                return (
                  <IntegrationElement key={`title-integration-${index}`}>
                    <Iconify icon={part.data.icon} sx={{ mr: 1 }} />
                    {part.data.name}
                  </IntegrationElement>
                );
              } else if (typeof part === "object" && part.type === "scope") {
                return (
                  <IntegrationScopeElement key={`title-scope-${index}`}>
                    <Iconify icon={part.data.icon} sx={{ mr: 1 }} />
                    {part.data.name}
                  </IntegrationScopeElement>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </>
        );
      }

      return title;
    } catch (error) {
      console.error("Error processing title content:", error);
      return title || "Add Title";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "140px",
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        px: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {title === null && messages.length > 0 ? (
            <>
              <Skeleton variant="text" width={200} height={24} />
            </>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {renderTitleContent()}
              </Typography>
              <IconButton onClick={handleEditClick}>
                {title ? <EditIcon /> : <AddIcon />}
              </IconButton>
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {description === null && messages.length > 0 ? (
            <Skeleton variant="text" width={200} height={24} />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                overflow: "hidden",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              {renderDescriptionContent()}
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog open={isEditing} onClose={handleCancelClick} fullWidth>
        <DialogTitle>
          {messages.length > 0
            ? "Edit Responsibility"
            : "Create Responsibility"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveClick} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsibilityChatTitle;
