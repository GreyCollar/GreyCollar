import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import FlowDialog from "../FlowDialog/FlowDialog";
import { Iconify } from "@canmingir/link/minimal/components";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import SupervisingTask from "../SupervisingTask/SupervisingTask";
import TaskIcon from "@mui/icons-material/Task";
import TaskResultDialog from "../TaskResultDialog/TaskResultDialog";
import TaskStepDialog from "../TaskStepDialog/TaskStepDialog";

import {
  AccordionDetails,
  Box,
  Card,
  Collapse,
  Fab,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const TaskCard = ({
  task,
  getSteps,
  steps,
  colleagueId,
  onExpand,
  expanded,
}) => {
  const [open, setOpen] = useState(false);
  const [stepResult, setStepResult] = useState(false);
  const [taskResult, setTaskResult] = useState(false);
  const [supervisingTask, setSupervisingTask] = useState(false);
  const [results, setResults] = useState([]);

  const handleFlowOpen = () => {
    setOpen(true);
    getSteps(task.id);
  };

  useEffect(() => {
    let interval;
    if (expanded || open) {
      interval = setInterval(() => {
        getSteps(task.id);
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line
  }, [expanded, open]);

  const handleStepResult = (step) => {
    setStepResult(true);
    setResults(step);
  };

  const handleTaskResult = () => {
    setTaskResult(true);
  };

  const handleSupervisingTask = () => {
    setSupervisingTask(true);
  };

  return (
    <Box sx={{ mt: 2 }} data-cy="tasks-card">
      <Card sx={{ width: "60%", margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            position: "relative",
            gap: 1,
            borderRadius: 5,
            padding: 3,
            height: 250,
          }}
        >
          {task.status !== "IN_PROGRESS" && (
            <Box
              sx={{
                position: "absolute",
                top: 22,
                right: 84,
              }}
            >
              <Tooltip title="Task Details">
                <Fab
                  data-cy="flow-button"
                  size="small"
                  sx={{
                    textAlign: "center",
                  }}
                  onClick={handleTaskResult}
                  color="default"
                >
                  <Iconify icon="material-symbols:table-eye-outline" />
                </Fab>
              </Tooltip>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 18,
              right: 22,
            }}
          >
            <Tooltip title="Supervising">
              <Fab
                data-cy="flow-button"
                size="medium"
                sx={{
                  textAlign: "center",
                  backgroundColor: (theme) => theme.palette.success.main,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.success.dark,
                  },
                }}
                onClick={handleSupervisingTask}
              >
                <Iconify icon="solar:users-group-rounded-bold" />
              </Fab>
            </Tooltip>
          </Box>

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
                paddingTop: 2,
              }}
            >
              <SourcedAvatar
                sx={{
                  width: 36,
                  height: 36,
                  mb: 1,
                  bgcolor: "primary.main",
                }}
              >
                <TaskIcon />
              </SourcedAvatar>

              <ListItemText
                primary={
                  <Typography color="inherit">{task.description}</Typography>
                }
                secondary={`Date: ${new Date(
                  task.createdAt
                ).toLocaleDateString()}`}
                primaryTypographyProps={{
                  typography: "subtitle1",
                }}
                secondaryTypographyProps={{
                  mt: 1,
                  component: "span",
                  typography: "caption",
                  color: "text.disabled",
                }}
              />

              <Stack
                spacing={0.5}
                direction="row"
                alignItems="center"
                sx={{
                  color:
                    task.status === "READ" ? "primary.main" : "success.main",
                  typography: "caption",
                }}
              >
                <Iconify width={16} icon="solar:users-group-rounded-bold" />
                Status: {task.status === "IN_PROGRESS" ? "In Progress" : "Done"}
              </Stack>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 22,
                right: 84,
              }}
            >
              <Tooltip title="Task Flow">
                <Fab
                  data-cy="flow-button"
                  size="small"
                  sx={{
                    textAlign: "center",
                  }}
                  onClick={handleFlowOpen}
                  color="default"
                >
                  <AccountTreeIcon />
                </Fab>
              </Tooltip>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 22,
                right: 28,
              }}
            >
              <Tooltip title="Task Steps">
                <Fab
                  data-cy="progress-button"
                  onClick={onExpand}
                  size="small"
                  sx={{
                    textAlign: "center",
                  }}
                  color="default"
                >
                  <ArrowCircleDownIcon />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      <Collapse in={expanded} timeout={700}>
        <Card
          sx={{
            bgcolor: "grey.400",
            width: "55%",
            margin: "0 auto",
            borderRadius: 0,
          }}
        >
          <AccordionDetails>
            <Table
              sx={{
                // bgcolor: "grey.200",
                borderRadius: 2,
                "& .MuiTableCell-root": {
                  color: "black",
                  borderBottom: "1px solid #bdbdbd",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Comment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(steps) &&
                  steps.map((step, i) => (
                    <TableRow key={i} data-cy="progress-card">
                      <TableCell>{step.comment}</TableCell>
                      <TableCell>
                        {new Date(step.createdAt).toDateString() ===
                        new Date().toDateString()
                          ? new Date(step.createdAt).toLocaleTimeString()
                          : new Date(step.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {step.status === "IN_PROGRESS" ? (
                          <Fab
                            sx={{
                              bgcolor: "primary.main",
                              "&:hover": {
                                bgcolor: "primary.main",
                              },
                            }}
                            size="small"
                          >
                            <Iconify
                              color="white"
                              width={16}
                              height={16}
                              icon="material-symbols:progress-activity"
                              sx={{
                                animation: "spin 1s linear infinite",
                                "@keyframes spin": {
                                  "0%": {
                                    transform: "rotate(0deg)",
                                  },
                                  "100%": {
                                    transform: "rotate(360deg)",
                                  },
                                },
                              }}
                            />
                          </Fab>
                        ) : (
                          <Fab
                            sx={{
                              bgcolor: "success.main",
                              "&:hover": {
                                bgcolor: "success.main",
                              },
                            }}
                            size="small"
                          >
                            <Iconify
                              color="white"
                              width={24}
                              height={24}
                              icon="material-symbols:done"
                            />
                          </Fab>
                        )}
                      </TableCell>
                      <TableCell>
                        <Fab
                          sx={{
                            bgcolor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.main",
                            },
                          }}
                          onClick={() => handleStepResult(step)}
                          size="small"
                          disabled={step.status === "IN_PROGRESS"}
                        >
                          <Iconify
                            color="white"
                            width={16}
                            height={16}
                            icon="material-symbols:folder-eye-outline"
                          />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Card>
      </Collapse>

      <SupervisingTask
        taskId={task.id}
        open={supervisingTask}
        setOpen={setSupervisingTask}
        colleagueId={colleagueId}
      />

      <TaskResultDialog open={taskResult} setOpen={setTaskResult} task={task} />

      <TaskStepDialog
        open={stepResult}
        setOpen={setStepResult}
        results={results}
      />

      <FlowDialog open={open} setOpen={setOpen} steps={steps} />
    </Box>
  );
};

export default TaskCard;
