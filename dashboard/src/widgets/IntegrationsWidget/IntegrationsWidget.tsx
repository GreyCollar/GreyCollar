import { Icon } from "@iconify/react";
import SkillDialog from "../../components/Skills/SkillDialog";
import Skills from "../../components/Skills/Skills";
import { getProviderLogo } from "../../utils/icon";
import { storage } from "@nucleoidjs/webstorage";
import useAcquiredIntegrations from "../../hooks/useAcquiredIntegrations";
import useTeam from "../../hooks/useTeam";

import {
  Box,
  Card,
  Container,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const mockIntegrations = [
  {
    id: "deb57fdb-4d92-4335-979c-edbce3bd6b00",
    title: "Slack",
    logo: "logos:slack",
    provider: "Slack",
  },
  {
    id: "262705b3-a4d5-4df7-8820-5ea4e1b362d4",
    title: "Discord",
    logo: "logos:discord",
    provider: "Discord",
  },
  {
    id: "3d75adcb-c7c3-4f8e-aec6-029091366b48",
    title: "Jira",
    logo: "logos:jira",
    provider: "Jira",
  },
  {
    id: "bd37432b-56d1-4226-9814-9163ed80c887",
    title: "GitHub",
    logo: "logos:github",
    provider: "GitHub",
  },
  {
    id: "b44c14d5-9d94-4a98-a6a3-6ec086f0e2e6",
    title: "Notion",
    logo: "logos:notion",
    provider: "Notion",
  },
  {
    id: "0919fcbe-d48d-4db5-afae-5777586f7df3",
    title: "Google Drive",
    logo: "logos:google-drive",
    provider: "Google Drive",
  },
  {
    id: "67784b37-dbc7-4878-899c-71c86880de11",
    title: "Trello",
    logo: "logos:trello",
    provider: "Trello",
  },
  {
    id: "4f117ca8-ca0d-44b3-86e5-8eb1e8e10cdc",
    title: "HubSpot",
    logo: "logos:hubspot",
    provider: "HubSpot",
  },
];

const IntegrationsWidget = () => {
  const teamId = storage.get("projectId");

  const { getIntegrations, getAcquiredIntegrations, getTokens } =
    useAcquiredIntegrations();
  const { integrations } = getIntegrations();
  const { acquiredIntegrations } = getAcquiredIntegrations(teamId);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [relatedSkills, setRelatedSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState<{
    id: string;
    name: string;
    logo: string;
    title: string;
    description: string;
    oauth: {
      scope: string;
      tokenUrl: string;
      clientId: string;
      redirectUri: string;
    };
  } | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);

  const { teamById } = useTeam(teamId);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = (integration) => {
    setSelectedIntegration(integration);
    const matchingSkills = integrations.filter(
      (skill) => skill.provider === integration.provider
    );
    setRelatedSkills(matchingSkills);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIntegration([]);
    setRelatedSkills([]);
  };

  const filteredData = integrations?.filter((skill) =>
    skill.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIntegrations = mockIntegrations.filter((skill) =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setSkillDialogOpen(true);
  };

  const handleSkillDialogClose = () => {
    setSkillDialogOpen(false);
    setSelectedSkill(null);
  };

  return (
    <Container>
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        variant="outlined"
        placeholder="Search integrations for team or colleagues"
        value={searchTerm}
        autoComplete="off"
        onChange={handleSearchChange}
      />

      <Grid container spacing={1} sx={{ mb: 2 }}>
        {searchTerm &&
          filteredIntegrations.map((integration) => (
            <Grid key={integration.id} item xs={12} sm={6} md={2}>
              <Card
                sx={{
                  height: 160,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
                }}
                onClick={() => handleOpen(integration)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Icon
                    icon={integration.logo.replace(/^:|:$/g, "")}
                    width="40"
                    height="40"
                  />
                  <Typography variant="h6">{integration.title}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid container spacing={2}>
        {filteredData?.map((skill) => (
          <Grid item xs={12} sm={6} md={3} key={skill.id}>
            <Skills
              id={skill.id}
              title={skill.provider}
              description={skill.description}
              logo={getProviderLogo(skill.provider)}
              oauth={skill.oauth}
              onSkillClick={handleSkillClick}
            />
          </Grid>
        ))}
      </Grid>

      <SkillDialog
        open={skillDialogOpen}
        handleClose={handleSkillDialogClose}
        skill={selectedSkill}
        team={teamById}
        acquiredIntegrations={acquiredIntegrations}
        getTokens={getTokens}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 5,
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          {selectedIntegration && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Icon icon={selectedIntegration.logo} width="40" height="40" />
                <Typography variant="h5" component="h2" sx={{ ml: 2 }}>
                  {selectedIntegration.title}
                </Typography>
                <Typography variant="h5" component="h2" sx={{ ml: 30 }}>
                  {selectedIntegration.provider}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Related Skills
              </Typography>
              <Grid container spacing={2}>
                {relatedSkills.map((skill, index) => (
                  <Grid item xs={6} key={index}>
                    <Skills
                      id={skill.id}
                      title={skill.title}
                      description={skill.description}
                      logo={skill.logo}
                      oauth={skill.oauth}
                      onSkillClick={handleSkillClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default IntegrationsWidget;
