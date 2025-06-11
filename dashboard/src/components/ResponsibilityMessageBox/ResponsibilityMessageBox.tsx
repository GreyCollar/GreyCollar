import { Iconify } from "@nucleoidai/platform/minimal/components";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { findIntegrationById } from "../ChatInput/chat.config";
import useColleagueV2 from "../../hooks/useColleagueV2";

import { Box, Typography } from "@mui/material";
import {
  IntegrationElement,
  IntegrationScopeElement,
  MentionElement,
} from "../ResponsibilityChat/IntegrationElement";

function ResponsibilityMessageBox({ message }) {
  const { getColleague } = useColleagueV2();
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
        padding: "10px",
        borderRadius: "10px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        userSelect: "text",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", marginBottom: "8px", userSelect: "text" }}
        data-cy="message-role"
      >
        {message.role === "user" ? "You" : "Assistant"}
      </Typography>
      <Typography
        variant="body1"
        sx={{ userSelect: "text" }}
        data-cy="message-content"
      >
        {renderContent()}
      </Typography>
    </Box>
  );
}

export default ResponsibilityMessageBox;
