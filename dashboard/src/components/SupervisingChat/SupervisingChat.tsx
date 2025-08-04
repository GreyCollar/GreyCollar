import { Iconify } from "@nucleoidai/platform/minimal/components";
import InlineChatInput from "../../widgets/ChatInput/InlineChatInput";
import PopupChatWidget from "../../widgets/PopupChatWidget/PopupChatWidget";
import ResponsibilityChatContent from "../ResponsibilityChat/ResponsibilityChatContent";
import useSupervisings from "../../hooks/useSupervisingsV2";

import {
  Alert,
  Backdrop,
  Box,
  Card,
  CardContent,
  Fab,
  IconButton,
  Slide,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { memo, useCallback } from "react";
import { alpha, useTheme } from "@mui/material";

const SupervisingChat = ({
  open = false,
  handleClose,
  readOnly = false,
  closeButton = true,
  loading = false,
  supervise,
}) => {
  const SUPERVISING_CHAT_WELCOME_MESSAGE =
    "Welcome to the Supervising Chat! Here you can discuss and supervise the ongoing tasks. Feel free to ask questions or provide guidance.";

  const { evaluateSupervising } = useSupervisings();

  const theme = useTheme();

  const [popChatOpen, setPopChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      role: "ASSISTANT",
      content: SUPERVISING_CHAT_WELCOME_MESSAGE,
    },
  ]);
  const [evaluationResult, setEvaluationResult] = React.useState<{
    type: string;
    message: string;
    guidance?: string;
    improved_suggestion?: string;
  }>({
    type: "",
    message: "",
    guidance: "",
    improved_suggestion: "",
  });
  const [isEvaluating, setIsEvaluating] = React.useState(false);

  const handleMessageSend = useCallback(
    async (message) => {
      if (message && supervise.id) {
        setMessages((prev) => [...prev, { role: "USER", content: message }]);
        setIsEvaluating(true);
        setEvaluationResult(null);

        const result = await evaluateSupervising(supervise.id, message);

        const { action, guidance, improved_suggestion } = result;

        if (action === "auto_sent") {
          setMessages((prev) => [
            ...prev,
            {
              role: "ASSISTANT",
              content:
                "✅ Great! Your answer was relevant and helpful. I've automatically sent it to PopChat and updated the supervising status.",
            },
          ]);
          setEvaluationResult({
            type: "success",
            message:
              "Answer automatically sent to PopChat and supervising updated!",
          });
        } else if (action === "needs_improvement") {
          let responseMessage =
            "I need you to improve your answer to make it more helpful. ";

          if (guidance) {
            responseMessage += `Here's my guidance: ${guidance}`;
          }

          if (improved_suggestion) {
            responseMessage += `\n\nHere's a suggested improvement: "${improved_suggestion}"`;
          }

          setMessages((prev) => [
            ...prev,
            {
              role: "ASSISTANT",
              content: responseMessage,
            },
          ]);
          setEvaluationResult({
            type: "warning",
            message: "Answer needs improvement before sending to PopChat.",
            guidance,
            improved_suggestion,
          });
        }

        setIsEvaluating(false);
      }
    },
    [supervise.id, evaluateSupervising]
  );

  return (
    <>
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{
          zIndex: theme.zIndex.drawer - 1,
          backgroundColor: alpha(theme.palette.common.black, 0.2),
        }}
      />
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Card
          elevation={24}
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "50vw",
            minWidth: "400px",
            maxWidth: "600px",
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default}80 100%)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px 0 0 16px",
            borderRight: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: theme.zIndex.drawer,
            boxShadow: theme.shadows[24],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Supervising Chat
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
              }}
            >
              <Tooltip title="See Full Conversation">
                <Fab
                  size="medium"
                  color="inherit"
                  onClick={() => setPopChatOpen(!popChatOpen)}
                >
                  <Iconify
                    icon={
                      popChatOpen
                        ? "solar:chat-round-line-linear"
                        : "solar:chat-round-line-bold"
                    }
                    sx={{ width: 26, height: 26 }}
                  />
                </Fab>
              </Tooltip>
              {closeButton && (
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Iconify icon="material-symbols:close" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Question Description Section */}
          {supervise.question && (
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}20`,
                backgroundColor: alpha(theme.palette.secondary.main, 0.03),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Question
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default}80 100%)`,
                  border: `1px solid ${theme.palette.divider}30`,
                  borderRadius: 1.5,
                  p: 1.5,
                }}
              >
                {supervise.question}
              </Typography>
            </Box>
          )}

          {evaluationResult && (
            <Box sx={{ p: 2 }}>
              <Alert
                severity={
                  evaluationResult.type as "success" | "warning" | "error"
                }
                sx={{ mb: 1 }}
                variant="filled"
              >
                {evaluationResult.message}
              </Alert>
              {evaluationResult.improved_suggestion && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Suggested improvement:
                  </Typography>
                  <Typography variant="body2">
                    {evaluationResult.improved_suggestion}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          <CardContent
            sx={{
              p: 0,
              "&:last-child": { pb: 0 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                paddingTop: {
                  xs: "8px",
                  sm: "10px",
                  md: "10px",
                },
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <ResponsibilityChatContent
                loading={loading || isEvaluating}
                messages={messages}
              />
            </Box>
            <Box
              sx={{ borderTop: `1px solid ${theme.palette.divider}20`, mt: 1 }}
            >
              <InlineChatInput
                onSend={readOnly ? undefined : handleMessageSend}
              />
            </Box>
          </CardContent>
        </Card>
      </Slide>

      <PopupChatWidget
        readOnly={true}
        openPopChat={popChatOpen}
        setOpenPopChat={setPopChatOpen}
        conversationId={supervise.conversationId}
        sessionId={supervise.sessionId}
      />
    </>
  );
};

export default memo(SupervisingChat);
