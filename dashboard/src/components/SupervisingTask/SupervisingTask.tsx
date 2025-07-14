import Joi from "joi";
import LoadingButton from "@mui/lab/LoadingButton";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import useTasks from "../../hooks/useTasks";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { FormProvider, RHFTextField } from "@canmingir/link/minimal/components";
import React, { useState } from "react";

const SupervisingTask = ({ open, setOpen, taskId, colleagueId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addToKnowledge, setAddToKnowledge] = useState(false);

  const { createTaskSupervising } = useTasks(colleagueId);

  const handleSwitchChange = (event) => {
    setAddToKnowledge(event.target.checked);
  };

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
    await createTaskSupervising(taskId, data.description, addToKnowledge);
    setIsSubmitting(false);
    setOpen(false);
    reset();
  });

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
        Supervising Task
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
            label="Enter supervising"
            multiline
            rows={"10"}
            data-cy="add-task-description"
            sx={{ mt: 1 }}
            autocomplete="off"
          />
          <FormControlLabel
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: "1.2rem",
              mt: 2,
              color: (theme) =>
                addToKnowledge
                  ? theme.palette.text.primary
                  : theme.palette.action.disabled,
            }}
            control={
              <Switch checked={addToKnowledge} onChange={handleSwitchChange} />
            }
            label="Add to Knowledge Base"
          />

          <DialogActions
            sx={{
              justifyContent: "flex-end",
              padding: "1rem",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            <LoadingButton
              disabled={!isValid || isSubmitting}
              type="submit"
              variant="contained"
              data-cy="finish"
            >
              Save
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisingTask;
