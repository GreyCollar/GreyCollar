import DoneIcon from "@mui/icons-material/Done";
import { Iconify } from "@canmingir/link/minimal/components";
import PopupChatWidget from "../../widgets/PopupChatWidget/PopupChatWidget";

import {
  Box,
  Card,
  Divider,
  Fab,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const SupervisingCard = ({ supervise, updateSupervising }) => {
  const [inputValues, setInputValues] = useState({});

  const handleSubmit = (superviseId) => {
    if (inputValues[superviseId]) {
      updateSupervising(superviseId, inputValues[superviseId]);
      setInputValues({
        ...inputValues,
        [superviseId]: "",
      });
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card data-cy="supervise-card">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            gap: 1,
            borderRadius: 5,
            padding: 2,
            height: 180,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 4,
                paddingTop: 1,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  paddingLeft: 0.5,
                  backgroundColor: "background.paper",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {supervise.question}
                </Typography>
              </Box>

              {supervise.answer ? (
                <TextField
                  data-cy="answer-supervising"
                  variant="outlined"
                  label="Answer"
                  value={`${supervise.answer}`}
                  InputProps={{
                    readOnly: true,
                    style: { cursor: "text" },
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      cursor: "default",
                    },
                    marginTop: 1,
                  }}
                />
              ) : (
                <TextField
                  multiline
                  rows={3}
                  label="Answer"
                  variant="outlined"
                  data-cy="answer-supervise"
                  value={inputValues[supervise.id] || ""}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      [supervise.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(supervise.id);
                    }
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            width: "100%",
                          }}
                        >
                          <Fab
                            size="small"
                            disabled={!inputValues[supervise.id]}
                            sx={{
                              position: "absolute",
                              bottom: 5,
                              right: 5,
                              backgroundColor: "inherit",
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "common.white",
                                color: "common.black",
                              },
                            }}
                          >
                            <DoneIcon
                              data-cy="send-answer"
                              onClick={() => handleSubmit(supervise.id)}
                            />
                          </Fab>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <TableContainer>
                <Table
                  size="small"
                  sx={{
                    tableLayout: "fixed",
                    width: "120px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            mt: 1,
                          }}
                        >
                          {(() => {
                            switch (supervise.status) {
                              case "IN_PROGRESS":
                                return "In Progress";
                              case "ANSWERED":
                                return "Answered";
                              default:
                                return supervise.status;
                            }
                          })()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Tooltip title="Go to sessions">
                <Fab
                  size="medium"
                  sx={{
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                  color="inherit"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <Iconify
                    icon={
                      open
                        ? "solar:chat-round-line-linear"
                        : "solar:chat-round-line-bold"
                    }
                    sx={{ width: 26, height: 26 }}
                  />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>
      <PopupChatWidget
        readOnly={true}
        openPopChat={open}
        setOpenPopChat={setOpen}
        conversationId={supervise.conversationId}
        sessionId={supervise.sessionId}
        sound={false}
      />
    </>
  );
};

export default SupervisingCard;
