import { Iconify } from "@canmingir/link/platform/components";
import LoadingButton from "@mui/lab/LoadingButton";
import type { Resolver } from "react-hook-form";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { yupResolver } from "@hookform/resolvers/yup";

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
import { Controller, useForm } from "react-hook-form";
import {
  FormProvider,
  RHFTextField,
} from "@canmingir/link/platform/components";
import React, { useEffect, useState } from "react";

import * as Yup from "yup";

function AddItemDialog({
  setSelectedType,
  selectedType,
  types,
  open,
  setOpen,
  addItem,
  colleagueId,
  teamId,
  teamById,
  colleagues,
  organizations,
}) {
  //TODO - Refactor here
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [selectedOptionType, setSelectedOptionType] = useState("");

  useEffect(() => {
    if (colleagueId) {
      setSelectedOptionId(colleagueId);
      setSelectedOptionType("colleague");
    } else if (organizations.length > 0) {
      setSelectedOptionId(organizations[0].id);
      setSelectedOptionType("organization");
    }
  }, [colleagueId, organizations]);

  const handleOptionChange = (event) => {
    const selectedOptionName = event.target.value;
    const selectedOption =
      organizations.find(
        (organization) => organization.name === selectedOptionName
      ) ||
      colleagues.find((colleague) => colleague.name === selectedOptionName) ||
      (teamById.name === selectedOptionName ? teamById : null);

    setSelectedOptionId(selectedOption?.id || "");
    if (
      organizations.find(
        (organization) => organization.name === selectedOptionName
      )
    ) {
      setSelectedOptionType("organization");
    } else if (
      colleagues.find((colleague) => colleague.name === selectedOptionName)
    ) {
      setSelectedOptionType("colleague");
    } else if (teamById.name === selectedOptionName) {
      setSelectedOptionType("team");
    }
  };

  type FormValues = {
    inputValue: string;
    question: string;
    answer: string;
  };

  const initialValues: FormValues = {
    inputValue: "",
    question: "",
    answer: "",
  };

  const AddItemSchema = Yup.object().shape({
    inputValue:
      selectedType === "URL"
        ? Yup.string()
            .required("URL cannot be an empty field")
            .url("Enter a valid URL")
        : selectedType !== "QA"
        ? Yup.string()
            .required(`${selectedType} cannot be an empty field`)
            .min(1)
        : Yup.string(),
    question:
      selectedType === "QA"
        ? Yup.string().required("Question cannot be an empty field").min(1)
        : Yup.string(),
    answer:
      selectedType === "QA"
        ? Yup.string().required("Answer cannot be an empty field").min(1)
        : Yup.string(),
  });

  const resolver: Resolver<FormValues> = yupResolver(
    AddItemSchema
  ) as Resolver<FormValues>;

  const methods = useForm({
    defaultValues: initialValues,
    resolver,
  });

  const {
    reset,
    handleSubmit,
    control,
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

    const payload = {
      ...item,
      ...(selectedOptionType === "organization" && { orgId: selectedOptionId }),
      teamId: selectedOptionType === "team" ? selectedOptionId : teamId,
      colleagueId:
        selectedOptionType === "colleague" ? selectedOptionId : colleagueId,
    };

    try {
      await addItem(payload, payload.colleagueId);
      setOpen(false);
    } catch (error) {
      setOpen(false);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  });

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
        {!colleagueId && (
          <Select
            fullWidth
            value={
              organizations.find(
                (organization) => organization.id === selectedOptionId
              )?.name ||
              colleagues.find((colleague) => colleague.id === selectedOptionId)
                ?.name ||
              (teamById.id === selectedOptionId ? teamById.name : "")
            }
            onChange={handleOptionChange}
          >
            {organizations.map((organization) => (
              <MenuItem key={organization.id} value={organization.name}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Iconify
                    icon={"jam:ghost-org-circle"}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ ml: 1 }}>{organization.name}</Box>
                </Box>
              </MenuItem>
            ))}

            <MenuItem value={teamById.name}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Iconify
                  icon={teamById.icon.replace(/^:|:$/g, "")}
                  sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ ml: 1 }}>{teamById.name}</Box>
              </Box>
            </MenuItem>

            {colleagues.map((colleague) => (
              <MenuItem key={colleague.id} value={colleague.name}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SourcedAvatar
                    source={"MINIMAL"}
                    avatarUrl={colleague.avatar}
                    name={colleague.name}
                  />
                  <Box sx={{ ml: 1 }}>{colleague.name}</Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        )}

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
            <Controller
              name="inputValue"
              control={control}
              render={({ field }) => (
                <>
                  <RHFTextField
                    {...field}
                    label={`Enter ${selectedType}`}
                    data-cy="add-item-input"
                  />
                </>
              )}
            />
          )}
          {selectedType === "QA" && (
            <Box>
              <Controller
                name="question"
                control={control}
                render={({ field }) => (
                  <>
                    <RHFTextField
                      {...field}
                      label="Enter Question"
                      sx={{ marginBottom: "1rem" }}
                      data-cy="add-item-question"
                    />
                  </>
                )}
              />
              <Controller
                name="answer"
                control={control}
                render={({ field }) => (
                  <>
                    <RHFTextField
                      {...field}
                      label="Enter Answer"
                      data-cy="add-item-answer"
                    />
                  </>
                )}
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
