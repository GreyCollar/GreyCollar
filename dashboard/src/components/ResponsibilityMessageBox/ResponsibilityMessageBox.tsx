import { Iconify } from "@canmingir/link/platform/components";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { findIntegrationById } from "../ChatInput/chat.config";
import useColleagueV2 from "../../hooks/useColleagueV2";

import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import {
  IntegrationElement,
  IntegrationScopeElement,
  MentionElement,
} from "../ResponsibilityChat/IntegrationElement";

function ResponsibilityMessageBox({ message }) {
  const { getColleague } = useColleagueV2();
  const theme = useTheme();

  const renderContent = () => {
    try {
      const parts = [];
      let currentIndex = 0;

      while (currentIndex < message.content.length) {
        const startBrace = message.content.indexOf("{", currentIndex);

        if (startBrace === -1) {
          if (currentIndex < message.content.length) {
            parts.push(message.content.substring(currentIndex));
          }
          break;
        }

        if (startBrace > currentIndex) {
          parts.push(message.content.substring(currentIndex, startBrace));
        }

        let braceCount = 0;
        let endBrace = startBrace;

        for (let i = startBrace; i < message.content.length; i++) {
          if (message.content[i] === "{") braceCount++;
          if (message.content[i] === "}") braceCount--;
          if (braceCount === 0) {
            endBrace = i;
            break;
          }
        }

        const jsonPart = message.content.substring(startBrace, endBrace + 1);
        parts.push(jsonPart);
        currentIndex = endBrace + 1;
      }

      return (
        <>
          {parts.map((part, index) => {
            try {
              const parsedContent = JSON.parse(part);

              if (parsedContent.type === "INTEGRATION") {
                const integration = findIntegrationById(parsedContent.id);

                return (
                  <>
                    {parsedContent.scope ? (
                      <>
                        <IntegrationElement key={part}>
                          <Iconify icon={integration.icon} sx={{ mr: 1 }} />
                          {integration.name}
                          <IntegrationScopeElement key={`${part}-scope`}>
                            <Iconify
                              icon={parsedContent.scope.icon}
                              sx={{ mr: 1 }}
                            />
                            {parsedContent.scope.name}
                          </IntegrationScopeElement>
                        </IntegrationElement>
                      </>
                    ) : (
                      <IntegrationElement key={part}>
                        <Iconify icon={integration.icon} sx={{ mr: 1 }} />
                        {integration.name}
                      </IntegrationElement>
                    )}
                  </>
                );
              } else if (parsedContent.type === "COLLEAGUE") {
                const { colleague, loading } = getColleague(parsedContent.id);

                return (
                  <MentionElement key={index}>
                    <SourcedAvatar
                      avatarUrl={loading ? "L" : colleague.avatar}
                      name="Colleague"
                      source="MINIMAL"
                      sx={{ mr: 1 }}
                    />
                    <Typography>
                      {loading ? "Loading..." : colleague.name}
                    </Typography>
                  </MentionElement>
                );
              }
            } catch {
              return <span key={index}>{part}</span>;
            }
          })}
        </>
      );
    } catch (error) {
      console.error("Error processing message content:", error);
      return message.content;
    }
  };

  const isUser = message.role === "USER";

  return (
    <Box
      data-cy="message-box"
      sx={{
        width: "100%",
        marginBottom: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: "85%",
          background: isUser
            ? `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.light}08 100%)`
            : `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.secondary.light}08 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${
            isUser
              ? theme.palette.primary.main + "20"
              : theme.palette.secondary.main + "20"
          }`,
          borderRadius: 2,
          overflow: "visible",
          position: "relative",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            border: `1px solid ${
              isUser
                ? theme.palette.primary.main + "40"
                : theme.palette.secondary.main + "40"
            }`,
            background: isUser
              ? `linear-gradient(135deg, ${theme.palette.primary.main}12 0%, ${theme.palette.primary.light}12 100%)`
              : `linear-gradient(135deg, ${theme.palette.secondary.main}12 0%, ${theme.palette.secondary.light}12 100%)`,
          },
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
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isUser
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 0.5,
              }}
              data-cy="message-role"
            >
              {isUser ? "You" : "Assistant"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                userSelect: "text",
                lineHeight: 1.6,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.5,
                color: theme.palette.text.primary,
              }}
              data-cy="message-content"
            >
              {renderContent()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResponsibilityMessageBox;
