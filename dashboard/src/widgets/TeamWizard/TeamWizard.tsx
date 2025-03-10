import DialogTitle from "@mui/material/DialogTitle";
import EnginesChart from "../AIMarketplace/AIMarketplaceCard";
import IconSelector from "../../components/IconSelector/IconSelector";
import SelectAvatar from "../../components/AvatarSelector/AvatarSelector";
import SparkleInput from "../../components/SparkleInput/SparkleInput";
import { Stack } from "@mui/material";
import StepComponent from "../../components/StepComponent/StepComponent";
import { Summary } from "../../components/ItemSummary/TeamSummary";
import { storage } from "@nucleoidjs/webstorage";
import useColleagues from "../../hooks/useColleagues";
import useOrganization from ".././../hooks/useOrganization";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useState } from "react";
import useTeams from "../../hooks/useTeams";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

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

function TeamWizard({ open, onClose }) {
  const projectId = storage.get("projectId");

  const [teamSelected] = useEvent("PROJECT_SELECTED", { projectId: null });

  const { organizations, loading } = useOrganizations();

  const [organization, setOrganization] = useState<{
    name: string;
  }>({
    name: "",
  });

  const [team, setTeam] = useState({
    team: "",
    avatar: "",
    src: "",
    name: "",
  });
  const [colleague, setColleague] = useState({
    name: "",
    avatar: "",
    src: "",
    character: "",
    role: "",
    aiEngineId: "",
    engineName: "",
  });

  const { createOrganization } = useOrganization();
  const { createColleague } = useColleagues();
  const { createTeam } = useTeams();

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

  const [activeStep, setActiveStep] = React.useState(0);

  const onSubmit = async ({ team, organization }) => {
    try {
      if (organization.id) {
        await createTeam(team, organization.id);
        publish("PLATFORM", "PROJECT_BAR_DIALOG", { open: false });
      } else {
        const result = await createOrganization(organization);
        await createTeam(team, result.id);
        publish("PLATFORM", "PROJECT_BAR_DIALOG", { open: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const projectId = storage.get("projectId");

    if (
      teamSelected.projectId === projectId &&
      Object.keys(colleague).length > 0
    ) {
      createColleague(colleague, projectId);
      setColleague({
        name: "",
        avatar: "",
        src: "",
        character: "",
        role: "",
        aiEngineId: "",
        engineName: "",
      });
      setOrganization({
        name: "",
      });
      setTeam({
        team: "",
        avatar: "",
        src: "",
        name: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSelected]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    await onSubmit({ organization, team });
    setActiveStep(0);
  };

  const handleEmojiSelect = (emoji) => {
    setTeam((prevItem) => {
      return {
        ...prevItem,
        avatar: `:${emoji.id}:`,
        src: `${emoji.src}`,
      };
    });
  };
  const handleAvatarSelect = (emoji) => {
    console.log(emoji);
    setColleague((prevItem) => {
      return {
        ...prevItem,
        avatar: `:${emoji.id}:`,
        src: `${emoji.src}`,
      };
    });
  };

  const Organization = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <SparkleInput
            data-cy="team-wizard-org-name-input"
            prop="Organization Name"
            value={organization.name}
            onChange={(e) =>
              setOrganization({ ...organization, name: e.target.value })
            }
            onRandomValue={""}
            multiline={""}
          />
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
                  onClick={() => {
                    setOrganization({
                      name: organization.name,
                    });
                    setActiveStep(activeStep + 1);
                  }}
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
          <SparkleInput
            data-cy="colleague-wizard-name-input"
            prop="Team Name"
            value={team.name}
            onChange={(e) => setTeam({ ...team, name: e.target.value })}
            onRandomValue={""}
            multiline={""}
          />
        </div>
      </div>
    );
  };

  const handleEngineSelect = (engine) => {
    setColleague((prevItem) => ({
      ...prevItem,
      aiEngineId: engine.id,
      engineName: engine.vendor,
    }));
    handleNext();
  };

  const handleRandomValue = (property) => {
    let randomValue;
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
      default:
        randomValue = "";
    }
    setColleague((prevItem) => ({ ...prevItem, [property]: randomValue }));
  };

  const handleTemplateSelect = (colleague) => {
    setColleague(colleague);
    setActiveStep(7);
  };

  const ColleagueName = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <SparkleInput
            data-cy="colleague-wizard-name-input"
            prop="name"
            value={colleague.name}
            onChange={(e) =>
              setColleague({ ...colleague, name: e.target.value })
            }
            onRandomValue={""}
            multiline={""}
          />
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
      <SparkleInput
        data-cy="colleague-wizard-character-input"
        prop="character"
        onChange={(e) =>
          setColleague({ ...colleague, character: e.target.value })
        }
        onRandomValue={() => handleRandomValue("character")}
        value={colleague.character}
        multiline
        rows={11}
      />
    );
  };

  const Responsibility = () => {
    return (
      <SparkleInput
        data-cy="colleague-wizard-role-input"
        prop="role"
        onChange={(e) => setColleague({ ...colleague, role: e.target.value })}
        onRandomValue={() => handleRandomValue("role")}
        value={colleague.role}
        multiline
        rows={11}
      />
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
              avatarSrc={team.src}
              avatar={team?.avatar?.replace(/:/g, "")}
            />
          </Stack>
        );
      case 2:
        return ColleagueName();
      case 3:
        return (
          <SelectAvatar
            handleEmojiSelect={handleAvatarSelect}
            avatarSrc={colleague.src}
            avatar={colleague?.avatar?.replace(/:/g, "")}
          />
        );
      case 4:
        return Personality();
      case 5:
        return Responsibility();
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
            team={team}
            organization={organization}
            colleague={colleague}
          />
        );
    }
  };

  return (
    <Dialog
      maxWidth={`xl`}
      open={open}
      onClose={() => {
        if (organizations.length !== 0 && projectId) {
          onClose();
          setTeam({
            team: "",
            avatar: "",
            src: "",
            name: "",
          });
          setOrganization({
            name: "",
          });
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
