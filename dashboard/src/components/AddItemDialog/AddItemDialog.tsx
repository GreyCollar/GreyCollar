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
  MenuItem,
  Select,
} from "@mui/material";
import {
  FormProvider,
  RHFTextField,
} from "@nucleoidai/platform/minimal/components";
import React, { useEffect, useState } from "react";

function AddItemDialog({
  setSelectedType,
  selectedType,
  types,
  open,
  setOpen,
  addItem,
  colleagueId,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [knowledgeLoaded] = useEvent("KNOWLEDGE_LOADED", null);

  const initialValues = {
    inputValue: "",
    question: "",
    answer: "",
  };

  console.log("AddItemDialog", colleagueId);
  console.log("AddItemDialog", selectedType);
  console.log("AddItemDialog", open);

  const validationSchema = Joi.object({
    inputValue:
      selectedType !== "QA"
        ? Joi.string()
            .required()
            .min(1)
            .messages({
              "string.empty": `${selectedType} cannot be an empty field`,
            })
        : Joi.string().allow(""),
    question:
      selectedType === "QA"
        ? Joi.string().required().min(1).messages({
            "string.empty": `Question cannot be an empty field`,
          })
        : Joi.string().allow(""),
    answer:
      selectedType === "QA"
        ? Joi.string().required().min(1).messages({
            "string.empty": `Answer cannot be an empty field`,
          })
        : Joi.string().allow(""),
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
    const item: {
      type: string;
      url?: string;
      text?: string;
      question?: string;
      answer?: string;
    } = { type: selectedType };
    if (selectedType === "URL") {
      item.url = data.inputValue;
    } else if (selectedType === "TEXT") {
      item.text = data.inputValue;
    } else if (selectedType === "QA") {
      item.question = data.question;
      item.answer = data.answer;
    }

    await addItem(item, colleagueId);
  });

  useEffect(() => {
    // setOpen(false);
    reset();
    setIsSubmitting(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeLoaded]);

  const handleChangeType = (event) => {
    setSelectedType(event.target.value);
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          setOpen(false);
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
        {`Add New ${selectedType}`}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Select
          fullWidth
          sx={{ mt: 2 }}
          value={selectedType}
          onChange={handleChangeType}
          data-cy="add-item-select"
        >
          {types.map((type) => (
            <MenuItem data-cy={`add-type-menu-${type}`} key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {selectedType !== "QA" && (
            <>
              <RHFTextField
                name="inputValue"
                label={`Enter ${selectedType}`}
                data-cy="add-item-input"
              />
            </>
          )}
          {selectedType === "QA" && (
            <Box>
              <RHFTextField
                name="question"
                label="Enter Question"
                sx={{ marginBottom: "1rem" }}
                data-cy="add-item-question"
              />
              <RHFTextField
                name="answer"
                label="Enter Answer"
                data-cy="add-item-answer"
              />
            </Box>
          )}
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

export default AddItemDialog;
