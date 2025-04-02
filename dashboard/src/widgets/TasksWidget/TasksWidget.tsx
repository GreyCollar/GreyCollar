import AddIcon from "@mui/icons-material/Add";
import AddTaskDialog from "../../components/AddTaskDialog/AddTaskDialog";
import StatusToolbar from "../../components/StatusToolbar/StatusToolbar";
import TaskCard from "../../components/TaskCard/TaskCard";
import useTasks from "../../hooks/useTasks";

import { Box, Container, Fab, Stack } from "@mui/material";
import React, { useState } from "react";

function TasksWidget({ colleagueId }) {
  const { tasks, getSteps, steps, createTask } = useTasks(colleagueId);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [open, setOpen] = useState(false);

  const task = tasks.filter(
    (task) =>
      selectedStatus === "All" || (task && task.status === selectedStatus)
  );

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleExpand = (taskId) => {
    getSteps(taskId);
    setExpandedTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StatusToolbar
          statuses={["All", "DONE", "IN_PROGRESS"]}
          handleChange={handleChange}
          selectedStatus={selectedStatus}
        />
        {task.length > 0 ? (
          task.map((t, i) => (
            <TaskCard
              colleagueId={colleagueId}
              task={t}
              key={i}
              getSteps={() => getSteps(t.id)}
              onExpand={() => handleExpand(t.id)}
              expanded={expandedTaskId === t.id}
              steps={steps}
            />
          ))
        ) : (
          <Stack sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
            No tasks available for the selected status
          </Stack>
        )}

        <Stack
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
          }}
        >
          <Fab
            variant="button"
            color="default"
            size="medium"
            sx={{
              mt: 2,
              zIndex: 0,
            }}
            data-cy="add-task-button"
            onClick={() => {
              setOpen(true);
              setExpandedTaskId(null);
            }}
          >
            <AddIcon />
          </Fab>
        </Stack>

        <AddTaskDialog
          open={open}
          setOpen={setOpen}
          createTask={createTask}
          colleagueId={colleagueId}
        />
      </Box>
    </Container>
  );
}

export default TasksWidget;
