import { Icon } from "@iconify/react";
import SkillDialog from "../../components/Skills/SkillDialog";
import Skills from "../../components/Skills/Skills";
import { storage } from "@nucleoidjs/webstorage";
import useColleagues from "../../hooks/useColleagues";
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

const mockData = [
  {
    id: "1e87e69f-8dbe-4f56-a8a7-1c87226f9c41",
    title: "Slack",
    description: "Receive messages and notifications from Slack",
    logo: "logos:slack",
    direction: "INCOMING",
  },
  {
    id: "2a65d8be-6c17-4d0b-bdc8-5c1f7fdd6e45",
    title: "Slack",
    description: "Send messages and automate workflows in Slack",
    logo: "logos:slack",
    direction: "OUTGOING",
    acquired: true,
  },
  {
    id: "3f4721a3-9d8b-420f-996c-4c8d6d315d24",
    title: "Discord",
    description: "Receive messages from Discord bots and users",
    logo: "logos:discord",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "4e91db99-fc99-40b7-bb5d-d5758a67b34b",
    title: "Discord",
    description: "Send bot messages and notifications in Discord",
    logo: "logos:discord",
    direction: "OUTGOING",
  },
  {
    id: "7a8e29d1-8f2a-4c1e-88ab-df3a1f64728e",
    title: "Jira",
    description: "Receive issue updates and new tickets",
    logo: "logos:jira",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "8a913f60-f76f-40cd-b7c2-e32c92c03e02",
    title: "Jira",
    description: "Create tickets and update issue statuses",
    logo: "logos:jira",
    direction: "OUTGOING",
  },
  {
    id: "9b31e5c9-2e41-482e-9d0c-ecb58d8b26f3",
    title: "GitHub",
    description: "Monitor pull requests, issues, and commits",
    logo: "logos:github",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "10b1f843-d13a-4d14-9386-271ac8b2f60b",
    title: "GitHub",
    description: "Create issues, merge PRs, and trigger workflows",
    logo: "logos:github",
    direction: "OUTGOING",
  },
  {
    id: "11d4a8c2-3f93-4681-874f-14cd52d8c5fa",
    title: "Google Drive",
    description: "Fetch documents and files from Google Drive",
    logo: "logos:google-drive",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "12e7d95a-8ef1-4b1e-9d5e-4325f1d5e5d4",
    title: "Google Drive",
    description: "Upload and manage files on Google Drive",
    logo: "logos:google-drive",
    direction: "OUTGOING",
  },
  {
    id: "21f5e3a9-0b5c-4d8a-95a1-937e6c3c4c72",
    title: "Notion",
    description: "Sync data and fetch notes from Notion",
    logo: "logos:notion",
    direction: "INCOMING",
  },
  {
    id: "22b3c1f4-2f3e-4e8d-9e37-6d72c58c4e41",
    title: "Notion",
    description: "Create and update pages in Notion",
    logo: "logos:notion",
    direction: "OUTGOING",
  },
  {
    id: "23a72f9d-91a2-4b31-8c3f-7c4d8e9b5f64",
    title: "Trello",
    description: "Monitor board updates and task changes",
    logo: "logos:trello",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "24b8d1e7-4c3a-4029-9e5f-27c4b1d6f739",
    title: "Trello",
    description: "Add tasks and manage workflows in Trello",
    logo: "logos:trello",
    direction: "OUTGOING",
    acquired: true,
  },
  {
    id: "25f9c8b3-1d2e-4a3f-9c8d-4b7a2e5c6d19",
    title: "HubSpot",
    description: "Receive CRM updates and lead notifications",
    logo: "logos:hubspot",
    direction: "INCOMING",
    acquired: true,
  },
  {
    id: "26d7b4e1-5a2c-4f89-8e3b-6d27c9f1b6d3",
    title: "HubSpot",
    description: "Update leads and contacts in HubSpot",
    logo: "logos:hubspot",
    direction: "OUTGOING",
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [relatedSkills, setRelatedSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState<{
    name: string;
    logo: string;
    title: string;
    description: string;
    acquired: boolean;
  } | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);

  const teamId = storage.get("projectId");

  const { teamById } = useTeam(teamId);

  const { colleagues } = useColleagues();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = (integration) => {
    setSelectedIntegration(integration);
    const matchingSkills = mockData.filter(
      (skill) => skill.title === integration.title
    );
    setRelatedSkills(matchingSkills);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIntegration([]);
    setRelatedSkills([]);
  };

  const filteredData = mockData.filter((skill) =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredData.map((skill) => (
          <Grid item xs={12} sm={6} md={3} key={skill.id}>
            <Skills
              title={skill.title}
              description={skill.description}
              logo={skill.logo}
              onSkillClick={handleSkillClick}
              acquired={skill.acquired}
            />
          </Grid>
        ))}
      </Grid>

      <SkillDialog
        open={skillDialogOpen}
        handleClose={handleSkillDialogClose}
        skill={selectedSkill}
        team={teamById}
        colleagues={colleagues}
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
                      title={skill.title}
                      description={skill.description}
                      logo={skill.logo}
                      onSkillClick={handleSkillClick}
                      acquired={skill.acquired}
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
