import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Iconify } from "@canmingir/link/platform/components";
import { ResponsibilityCommands } from "../ChatInput/chat.config";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
      // TODO: Extract integrations and its scopes
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
      const modifiedDescription = description;

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

        matches.forEach((match) => {
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
      const modifiedTitle = title;

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

        matches.forEach((match) => {
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
        mb: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "visible",
          position: "relative",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
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
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {title === null && messages.length > 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton
                      variant="rectangular"
                      width={180}
                      height={28}
                      sx={{ borderRadius: 1.5 }}
                    />
                  </Box>
                ) : (
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 0.5,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      lineHeight: 1.2,
                      background: title
                        ? "inherit"
                        : `linear-gradient(45deg, ${theme.palette.text.disabled}, ${theme.palette.text.secondary})`,
                      backgroundClip: title ? "inherit" : "text",
                      WebkitBackgroundClip: title ? "inherit" : "text",
                      WebkitTextFillColor: title ? "inherit" : "transparent",
                    }}
                  >
                    {renderTitleContent()}
                  </Typography>
                )}
              </Box>

              <IconButton
                onClick={handleEditClick}
                size="small"
                aria-label={title ? "Edit title" : "Add title"}
                sx={{
                  backgroundColor: theme.palette.primary.main + "10",
                  border: `1px solid ${theme.palette.primary.main}20`,
                  color: theme.palette.primary.main,
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main + "20",
                    borderColor: theme.palette.primary.main + "40",
                  },
                }}
              >
                {title ? (
                  <EditIcon fontSize="small" />
                ) : (
                  <AddIcon fontSize="small" />
                )}
              </IconButton>
            </Box>

            <Box>
              {description === null && messages.length > 0 ? (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Skeleton
                    variant="rectangular"
                    width={130}
                    height={20}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={20}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={20}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              ) : description ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.5,
                    lineHeight: 1.4,
                    fontSize: "0.875rem",
                  }}
                >
                  {renderDescriptionContent()}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontStyle: "italic",
                    opacity: 0.7,
                    fontSize: "0.8rem",
                  }}
                >
                  No description provided
                </Typography>
              )}
            </Box>

            {messages.length > 0 && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}
              >
                <Chip
                  label={`${messages.length} message${
                    messages.length !== 1 ? "s" : ""
                  }`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.primary.main + "30",
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main + "08",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isEditing}
        onClose={handleCancelClick}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: "1.25rem",
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {messages.length > 0
            ? "Edit Responsibility"
            : "Create Responsibility"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title || ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: theme.palette.background.default + "50",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main + "80",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
              },
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCancelClick}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: theme.shadows[3],
              "&:hover": {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                boxShadow: theme.shadows[1],
                color: "white",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsibilityChatTitle;
