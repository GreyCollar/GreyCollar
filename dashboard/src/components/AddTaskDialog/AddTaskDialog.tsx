import Joi from "joi";
import LoadingButton from "@mui/lab/LoadingButton";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEvent } from "@nucleoidai/react-event";
import { useForm } from "react-hook-form";

import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  FormProvider,
  RHFTextField,
} from "@canmingir/link/platform/components";
import React, { useEffect, useState } from "react";

function AddTaskDialog({ open, setOpen, createTask, colleagueId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskLoaded] = useEvent("TASK_LOADED", null);

  const initialValues = {
    description: "",
  };

  const validationSchema = Joi.object({
    description: Joi.string().required().min(1).messages({
      "string.empty": "Description cannot be empty",
    }),
  });

  const methods = useForm({
    defaultValues: initialValues,
    resolver: joiResolver(validationSchema),
    mode: "onChange",
  });

  const {
    reset,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    await createTask(data.description, colleagueId);
  });

  useEffect(() => {
    setOpen(false);
    reset();
    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskLoaded]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          setOpen(false);
          reset();
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          textAlign: "center",
        }}
      >
        Add New Task
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFTextField
            name="description"
            label="Enter Task"
            multiline
            rows={"10"}
            data-cy="add-task-description"
            sx={{ mt: 1 }}
            autcomplete="off"
          />
          <DialogActions
            sx={{
              justifyContent: "flex-end",
              padding: "1rem",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={!isValid || isSubmitting}
              data-cy="finish"
            >
              {isSubmitting ? (
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress
                    size={18}
                    color="inherit"
                    style={{ marginRight: "8px" }}
                  />
                  Save
                </Box>
              ) : (
                <Box style={{ display: "flex", alignItems: "center" }}>
                  Save
                </Box>
              )}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskDialog;
