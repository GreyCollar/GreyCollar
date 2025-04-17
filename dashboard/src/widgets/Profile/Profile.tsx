import AIMarketplaceItem from "../AIMarketplace/AIMarketplaceItem";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from "@mui/material";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import Stack from "@mui/material/Stack";
import useColleague from "../../hooks/useColleagueV2";

import { CardHeader, Fab, InputBase, Typography, alpha } from "@mui/material";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

function Profile({ colleagueId }) {
  //TODO - Refactor here
  const { updateColleague, getColleague } = useColleague();
  const { colleague, loading } = getColleague(colleagueId);

  const engine = colleague?.AIEngine;

  const [character, setCharacter] = useState(colleague?.character);
  const [role, setRole] = useState(colleague?.role);
  const [tempCharacter, setTempCharacter] = useState(colleague?.character);
  const [tempRole, setTempRole] = useState(colleague?.role);
  const [isUpdated, setIsUpdated] = useState(true);

  useEffect(() => {
    if (colleague) {
      setCharacter(colleague.character);
      setRole(colleague.role);
      setTempCharacter(colleague.character);
      setTempRole(colleague.role);
    }
  }, [colleague]);

  const handleUpdate = () => {
    if (!isUpdated) {
      setCharacter(tempCharacter);
      setRole(tempRole);
      updateColleague({ ...colleague, character, role });
    }
    setIsUpdated(!isUpdated);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: "body2" }}>{character}</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: "body2" }}>{colleague.name}</Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: "body2" }}>{role}</Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderEngine = (
    <AIMarketplaceItem
      engine={engine}
      isWizardEngine={""}
      handleEngineSelect={""}
    />
  );

  const renderRole = (
    <>
      <Card sx={{ p: 3 }}>
        <CardHeader title="Role" sx={{ p: 2 }} />

        <Stack spacing={1}>
          {isUpdated ? (
            <Typography sx={{ p: 2 }}>{role}</Typography>
          ) : (
            <InputBase
              onChange={(e) => setTempRole(e.target.value)}
              fullWidth
              placeholder={role}
              data-cy="role"
              sx={{
                p: 1,
                mb: 2,
                ml: 2,
                borderRadius: 1,
                border: (theme) =>
                  `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
              }}
            />
          )}
        </Stack>

        <CardHeader title="Character" sx={{ p: 2 }} />

        {isUpdated ? (
          <Typography sx={{ p: 2 }}>{character}</Typography>
        ) : (
          <InputBase
            onChange={(e) => setTempCharacter(e.target.value)}
            fullWidth
            placeholder={character}
            data-cy="character"
            sx={{
              p: 1,
              mb: 2,
              ml: 2,
              borderRadius: 1,
              border: (theme) =>
                `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
            }}
          />
        )}

        <Stack
          direction="column"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Fab
            color="default"
            size="small"
            data-cy="edit-icon"
            onClick={handleUpdate}
          >
            {isUpdated ? <EditIcon /> : <CheckIcon />}
          </Fab>
        </Stack>
      </Card>
    </>
  );

  return (
    <Stack margin={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Stack spacing={3}>{renderAbout}</Stack>
            <Stack spacing={3}>{renderEngine}</Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={3}>{renderRole}</Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
export default Profile;
