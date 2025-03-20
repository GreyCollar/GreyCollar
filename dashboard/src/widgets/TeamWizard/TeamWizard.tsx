import DialogTitle from "@mui/material/DialogTitle";
import EnginesChart from "../AIMarketplace/AIMarketplaceCard";
import IconSelector from "../../components/IconSelector/IconSelector";
import type { Resolver } from "react-hook-form";
import SelectAvatar from "../../components/AvatarSelector/AvatarSelector";
import SparkleInput from "../../components/SparkleInput/SparkleInput";
import { Stack } from "@mui/material";
import StepComponent from "../../components/StepComponent/StepComponent";
import { Summary } from "../../components/ItemSummary/TeamSummary";
import { storage } from "@nucleoidjs/webstorage";
import useColleagues from "../../hooks/useColleagues";
import useOrganizations from ".././../hooks/useOrganziationsV2";
import useTeams from "../../hooks/useTeams";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

import * as Yup from "yup";

const sampleColleagues = [
  {
    name: "Alex Thompson",
    avatar: ":2:",
    src: `https://cdn.nucleoid.com/greycollar/avatars/2.jpg`,
    character: "Quick-Witted",
    role: "Software Engineer",
    aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
    engineName: "OpenAI",
  },
  {
    name: "Sarah Chen",
    avatar: ":5:",
    src: `https://cdn.nucleoid.com/greycollar/avatars/5.jpg`,
    character: "Ambitious",
    role: "Data Scientist",
    aiEngineId: "d9c93323-3baf-4623-a96c-b85db99b4441",
    engineName: "Claude",
  },
  {
    name: "Marcus Williams",
    avatar: ":8:",
    src: `https://cdn.nucleoid.com/greycollar/avatars/8.jpg`,
    character: "Natural Leader",
    role: "Product Manager",
    aiEngineId: "123a3c9a-b23b-421a-ac6e-f14052a2d57c",
    engineName: "DeepMind",
  },
];

const names = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Ava",
  "Elijah",
  "Sophia",
  "James",
  "Isabella",
  "Mason",
];

const characters = [
  "Brave",
  "Quick-Witted",
  "Mysterious",
  "Loyal Companion",
  "Charismatic",
  "Deep Thinker",
  "Strong-Willed",
  "Ambitious",
  "Free Spirit",
  "Natural Leader",
];

const roles = [
  "Scientist",
  "Detective",
  "Journalist",
  "Architect",
  "Chef",
  "Teacher",
  "Engineer",
  "Pilot",
  "Artist",
  "Paramedic",
];

type PropertyOptionType = "name" | "character" | "role";

function TeamWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const projectId = storage.get("projectId");
  const [teamSelected] = useEvent("PROJECT_SELECTED", { projectId: null });
  const { organizations, loading } = useOrganizations().getOrganizations([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const { create } = useOrganizations().createOrganization();
  const { createColleague } = useColleagues();
  const { createTeam } = useTeams();

  type FormValues = {
    organization: {
      id?: string;
      name: string;
    };
    team: {
      name: string;
      avatar?: string;
      src?: string;
    };
    colleague: {
      title?: string;
      name: string;
      avatar?: string;
      character: string;
      role: string;
      teamId?: string;
      aiEngineId: string;
      engineName?: string;
    };
  };

  const TeamWizardSchema = Yup.object().shape({
    organization: Yup.object().shape({
      id: Yup.string().optional(),
      name: Yup.string().required("Organization name is required"),
    }),
    team: Yup.object().shape({
      name: Yup.string().required("Team name is required"),
      avatar: Yup.string().optional(),
      src: Yup.string().optional(),
    }),
    colleague: Yup.object().shape({
      title: Yup.string().optional(),
      name: Yup.string().required("Colleague name is required"),
      avatar: Yup.string().optional(),
      character: Yup.string().required("Character is required"),
      role: Yup.string().required("Role is required"),
      teamId: Yup.string().optional(),
      aiEngineId: Yup.string().required("AI Engine is required"),
      engineName: Yup.string().optional(),
    }),
  });

  const defaultValues: FormValues = {
    organization: {
      id: undefined,
      name: "",
    },
    team: {
      name: "",
      avatar: "",
      src: "",
    },
    colleague: {
      title: "",
      name: "",
      avatar: "",
      character: "",
      role: "",
      teamId: "",
      aiEngineId: "",
      engineName: "",
    },
  };

  const resolver: Resolver<FormValues> = yupResolver(
    TeamWizardSchema
  ) as Resolver<FormValues>;

  const methods = useForm<FormValues>({
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = methods;

  const steps = [
    "Organization",
    "Team",
    "AI Colleague",
    "Avatar",
    "Character",
    "Role",
    "Engine",
    "Summary",
  ];

  const stepExp = [
    "Create Organization",
    "Create Team",
    "Give colleague a name.",
    "Select an avatar that reflects your colleague.",
    "Write down your colleague's eole. this will determine your colleague's behavior.",
    "Write your colleague's role. this will determine your colleague's role.",
    "Select your colleague's engine. this will determine your colleague's engine.",
  ];

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (data.organization.id) {
          await createTeam(data.team, data.organization.id);
          publish("PLATFORM", "PROJECT_BAR_DIALOG", { open: false });
        } else {
          const result = await create(data.organization);
          await createTeam(data.team, result.id);
          publish("PLATFORM", "PROJECT_BAR_DIALOG", { open: false });
        }

        setActiveStep(0);
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    (errors) => {
      console.log("Validation errors:", errors);

      if (errors.organization) {
        setActiveStep(0);
        return;
      }

      if (errors.team) {
        setActiveStep(1);
        return;
      }

      if (errors.colleague) {
        if (errors.colleague.name) {
          setActiveStep(2);
        } else if (errors.colleague.avatar) {
          setActiveStep(3);
        } else if (errors.colleague.character) {
          setActiveStep(4);
        } else if (errors.colleague.role) {
          setActiveStep(5);
        } else if (errors.colleague.aiEngineId) {
          setActiveStep(6);
        }
      }
    }
  );

  useEffect(() => {
    const projectId = storage.get("projectId");
    console.log("projectId", projectId);
    console.log("name", getValues("colleague.name"));
    if (teamSelected.projectId === projectId && getValues("colleague.name")) {
      const colleague = getValues("colleague");
      colleague.teamId = teamSelected.projectId;
      createColleague(colleague, projectId);
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSelected]);

  const handleNext = () => {
    const currentStep = activeStep;

    switch (currentStep) {
      case 0:
        methods.trigger("organization.name").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      case 1:
        methods.trigger("team.name").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      case 2:
        methods.trigger("colleague.name").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      case 3:
        break;

      case 4:
        methods.trigger("colleague.character").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      case 5:
        methods.trigger("colleague.role").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      case 6:
        methods.trigger("colleague.aiEngineId").then((isValid) => {
          if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
          }
        });
        return;

      default:
        break;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    const errors = methods.formState.errors;

    if (errors.organization?.name) {
      setActiveStep(0);
      return;
    }

    if (errors.team?.name) {
      setActiveStep(1);
      return;
    }

    if (errors.colleague?.name) {
      setActiveStep(2);
      return;
    }

    if (errors.colleague?.avatar) {
      setActiveStep(3);
      return;
    }

    if (errors.colleague?.character) {
      setActiveStep(4);
      return;
    }

    if (errors.colleague?.role) {
      setActiveStep(5);
      return;
    }

    if (errors.colleague?.aiEngineId) {
      setActiveStep(6);
      return;
    }

    onSubmit();
    setActiveStep(0);
  };

  const handleEmojiSelect = (emoji: { id: string; src: string }) => {
    setValue("team.avatar", `:${emoji.id}:`, { shouldValidate: true });
    setValue("team.src", `${emoji.src}`, { shouldValidate: true });
  };

  const handleAvatarSelect = (emoji: { id: string; src: string }) => {
    setValue("colleague.avatar", `:${emoji.id}:`, { shouldValidate: true });
  };

  const handleEngineSelect = (engine: { id: string; vendor: string }) => {
    setValue("colleague.aiEngineId", engine.id, { shouldValidate: true });
    setValue("colleague.engineName", engine.vendor, { shouldValidate: true });
    handleNext();
  };

  const handleRandomValue = (property: PropertyOptionType) => {
    let randomValue = "";
    switch (property) {
      case "name":
        randomValue = names[Math.floor(Math.random() * names.length)];
        break;
      case "character":
        randomValue = characters[Math.floor(Math.random() * characters.length)];
        break;
      case "role":
        randomValue = roles[Math.floor(Math.random() * roles.length)];
        break;
    }

    if (property === "name") {
      setValue("colleague.name", randomValue, { shouldValidate: true });
    } else if (property === "character") {
      setValue("colleague.character", randomValue, { shouldValidate: true });
    } else if (property === "role") {
      setValue("colleague.role", randomValue, { shouldValidate: true });
    }
  };

  const handleTemplateSelect = (colleagueTpl: (typeof sampleColleagues)[0]) => {
    setValue("colleague.name", colleagueTpl.name, { shouldValidate: true });
    setValue("colleague.avatar", colleagueTpl.avatar, { shouldValidate: true });
    setValue("colleague.character", colleagueTpl.character, {
      shouldValidate: true,
    });
    setValue("colleague.role", colleagueTpl.role, { shouldValidate: true });
    setValue("colleague.aiEngineId", colleagueTpl.aiEngineId, {
      shouldValidate: true,
    });
    setValue("colleague.engineName", colleagueTpl.engineName, {
      shouldValidate: true,
    });
    setActiveStep(7);
  };

  const handleOrganizationSelect = (organization: {
    id: string;
    name: string;
  }) => {
    setValue(
      "organization",
      {
        ...organization,
        name: organization.name,
      },
      { shouldValidate: true }
    );
    setActiveStep(activeStep + 1);
  };

  const Organization = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <Controller
            name="organization.name"
            control={control}
            render={({ field }) => (
              <SparkleInput
                data-cy="team-wizard-org-name-input"
                prop="Organization Name"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onRandomValue={""}
                multiline={""}
              />
            )}
          />
          {errors.organization?.name && (
            <Typography color="error" variant="caption">
              {errors.organization.name.message}
            </Typography>
          )}
        </div>
        {organizations.length > 0 && (
          <div>
            <Typography variant="body2" gutterBottom textAlign={"center"}>
              or Choose Existing Organization
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {organizations.map((organization) => (
                <Card
                  key={organization.id}
                  onClick={() => handleOrganizationSelect(organization)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardActionArea>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {organization.name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </div>
        )}
      </div>
    );
  };

  const Name = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <Controller
            name="team.name"
            control={control}
            render={({ field }) => (
              <SparkleInput
                data-cy="colleague-wizard-name-input"
                prop="Team Name"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onRandomValue={""}
                multiline={""}
              />
            )}
          />
          {errors.team?.name && (
            <Typography color="error" variant="caption">
              {errors.team.name.message}
            </Typography>
          )}
        </div>
      </div>
    );
  };

  const ColleagueName = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <Controller
            name="colleague.name"
            control={control}
            render={({ field }) => (
              <SparkleInput
                data-cy="colleague-wizard-name-input"
                prop="name"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onRandomValue={""}
                multiline={""}
              />
            )}
          />
          {errors.colleague?.name && (
            <Typography color="error" variant="caption">
              {errors.colleague.name.message}
            </Typography>
          )}
        </div>

        <div>
          <Typography variant="body2" gutterBottom textAlign={"center"}>
            Or choose one of the samples
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {sampleColleagues.map((colleague, index) => (
              <Card
                key={index}
                onClick={() => handleTemplateSelect(colleague)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <img
                        src={colleague.src}
                        alt={colleague.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="h6" component="div">
                        {colleague.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {colleague.role}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {colleague.character}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </div>
      </div>
    );
  };

  const Personality = () => {
    return (
      <>
        <Controller
          name="colleague.character"
          control={control}
          render={({ field }) => (
            <SparkleInput
              data-cy="colleague-wizard-character-input"
              prop="character"
              onChange={(e) => field.onChange(e.target.value)}
              onRandomValue={() => handleRandomValue("character")}
              value={field.value}
              multiline
              rows={11}
            />
          )}
        />
        {errors.colleague?.character && (
          <Typography color="error" variant="caption">
            {errors.colleague.character.message}
          </Typography>
        )}
      </>
    );
  };

  const Responsibility = () => {
    return (
      <>
        <Controller
          name="colleague.role"
          control={control}
          render={({ field }) => (
            <SparkleInput
              data-cy="colleague-wizard-role-input"
              prop="role"
              onChange={(e) => field.onChange(e.target.value)}
              onRandomValue={() => handleRandomValue("role")}
              value={getValues("colleague.role")}
              multiline
              rows={11}
            />
          )}
        />
        {errors.colleague?.role && (
          <Typography color="error" variant="caption">
            {errors.colleague.role.message}
          </Typography>
        )}
      </>
    );
  };

  const StepPages = () => {
    switch (activeStep) {
      case 0:
        return <Organization />;
      case 1:
        return (
          <Stack spacing={2}>
            <Name />
            <IconSelector
              handleEmojiSelect={handleEmojiSelect}
              avatarSrc={getValues("team.src")}
              avatar={getValues("team.avatar")?.replace(/:/g, "")}
            />
          </Stack>
        );
      case 2:
        return <ColleagueName />;
      case 3:
        return (
          <SelectAvatar
            handleEmojiSelect={handleAvatarSelect}
            avatarSrc={
              getValues("colleague.avatar")?.includes(":")
                ? `https://cdn.nucleoid.com/greycollar/avatars/${getValues(
                    "colleague.avatar"
                  ).replace(/:/g, "")}.jpg`
                : ""
            }
            avatar={getValues("colleague.avatar")?.replace(/:/g, "")}
          />
        );
      case 4:
        return <Personality />;
      case 5:
        return <Responsibility />;
      case 6:
        return (
          <EnginesChart
            handleEngineSelect={handleEngineSelect}
            isWizardEngine={true}
            open={""}
            setOpen={""}
          />
        );
      case 7:
        return (
          <Summary
            team={getValues("team")}
            organization={getValues("organization")}
            colleague={getValues("colleague")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      maxWidth={`xl`}
      open={open}
      onClose={() => {
        if (organizations.length !== 0 && projectId) {
          onClose();
          reset(defaultValues);
          setActiveStep(0);
        }
      }}
    >
      <>
        <DialogTitle
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        ></DialogTitle>
        <StepComponent
          activeStep={activeStep}
          steps={steps}
          stepExp={stepExp}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSave={handleSave}
        >
          <DialogContent
            sx={{
              width: "100%",
              height: "100%",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            {StepPages()}
          </DialogContent>
        </StepComponent>
      </>
    </Dialog>
  );
}

export default TeamWizard;
