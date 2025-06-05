import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";

import { Card, CardContent, CardHeader, Typography } from "@mui/material";

export default function ItemSummary({ newItem }) {
  console.log("ItemSummary newItem:", newItem);

  return (
    <>
      <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
        Colleague Summary
      </DialogContentText>
      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          sx={{
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
        >
          <Card
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.customShadows.card,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <CardContent
              children={
                <>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    mb={2}
                    data-cy="item-summary-name-area"
                  >
                    {newItem.name}
                  </Typography>
                  <SourcedAvatar
                    name={newItem.name}
                    source={
                      newItem.src ||
                      `https://cdn.nucleoid.com/greycollar/avatars/${newItem?.avatar?.replace(
                        /:/g,
                        ""
                      )}.jpg`
                    }
                    avatarUrl={newItem.avatarUrl}
                    sx={{
                      display: "flex",
                      alignSelf: "center",
                      justifySelf: "center",
                      width: { xs: 40, md: 104 },
                      height: { xs: 40, md: 104 },
                      border: `solid 2px ${(theme) =>
                        theme.palette.common.white}`,
                    }}
                  >
                    {newItem.children}
                  </SourcedAvatar>
                </>
              }
            />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Character" />
            <CardContent>
              <Typography data-cy="item-summary-character-area">
                {newItem.character}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Title" />
            <CardContent>
              <Typography data-cy="item-summary-title-area">
                {newItem.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Engine" />
            <CardContent>
              <Typography data-cy="item-summary-role-area">
                {newItem.engineName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader title="Role" />
            <CardContent>
              <Typography data-cy="item-summary-role-area">
                {newItem.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
