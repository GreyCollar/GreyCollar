import { Iconify } from "@nucleoidai/platform/minimal/components";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { findIntegrationById } from "../ChatInput/chat.config";
import useColleagueV2 from "../../hooks/useColleagueV2";

import { Box, Typography } from "@mui/material";
import {
  IntegrationElement,
  MentionElement,
} from "../ResponsibilityChat/IntegrationElement";

function ResponsibilityMessageBox({ message }) {
  const { getColleague } = useColleagueV2();
  const renderContent = () => {
    try {
      const parts = message.content.split(/(\{.*?\})/).filter(Boolean);

      return (
        <>
          {parts.map((part, index) => {
            try {
              const parsedContent = JSON.parse(part);

              if (parsedContent.type === "INTEGRATION") {
                const integration = findIntegrationById(parsedContent.id);
                return (
                  <IntegrationElement key={part}>
                    <Iconify icon={integration.icon} sx={{ mr: 1 }} />
                    <Typography>{integration.name}</Typography>
                  </IntegrationElement>
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
