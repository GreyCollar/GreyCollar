import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import Stack from "@mui/material/Stack";
import { getBackgroundUrl } from "../../utils/background";

import {
  CustomPopover,
  Iconify,
  Image,
  usePopover,
} from "@nucleoidai/platform/minimal/components";
import {
  Fab,
  IconButton,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function ColleagueCard({ colleague, onView, onEdit, onDelete }) {
  const theme = useTheme();
  const popover = usePopover();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(345));

  return (
    <Card sx={{ width: "300px" }}>
      <Fab
        data-cy="colleague-card-more-vert"
        color="default"
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          boxShadow: 2,
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.23)",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Fab>
      <Card
        key={colleague.name}
        sx={{
          textAlign: "center",
          width: "300px",
          minWidth: 200,
          cursor: "pointer",
        }}
        onClick={onView}
        data-cy="colleague-card"
      >
        <Box sx={{ position: "relative" }}>
          {colleague.avatar ? (
            <SourcedAvatar
              data-cy="colleague-card-avatar"
              name={colleague.name}
              source={"MINIMAL"}
              avatarUrl={colleague.avatar}
              sx={{
                width: 64,
                height: 64,
                zIndex: 11,
                left: 0,
                right: 0,
                bottom: -32,
                mx: "auto",
                position: "absolute",
              }}
            >
              {colleague.name}
            </SourcedAvatar>
          ) : (
            <Avatar />
          )}

          <Image
            src={getBackgroundUrl(colleague.id)}
            alt={colleague.coverUrl}
            ratio="16/9"
            overlay={alpha(theme.palette.grey[900], 0.48)}
          />
        </Box>
        <Stack
          sx={{
            mt: 5,
            mb: 2,
          }}
          direction={"column"}
        >
          <Typography variant="subtitle1" data-cy="colleague-card-name">
            {colleague.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "gray", ml: 1, mt: 0.4 }}
            component={"span"}
          >
            {colleague.createdAt}
          </Typography>
        </Stack>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack
          direction={"column"}
          sx={{
            gap: 2,
            margin: 2,
            alignItems: "center",
          }}
        >
          <Stack
            direction="column"
            sx={{
              typography: "body2",
              padding: 2,
              borderRadius: 1,
              border: "dotted 1px gray",
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ paddingY: "0.5rem" }}
            >
              <Iconify icon={"ph:note-pencil-duotone"} width={24} />
              <Typography variant="subtitle1">Role</Typography>
            </Stack>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "center",
                overflow: "hidden",
                height: 45,
              }}
            >
              <Typography
                color={"inherit"}
                variant={"body2"}
                textAlign={"start"}
                data-cy="colleague-card-role-area"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  maxHeight: 45,
                }}
              >
                {colleague.role}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            sx={{
              typography: "body2",
              padding: 2,
              borderRadius: 1,
              border: "dotted 1px gray",
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ paddingY: "0.5rem" }}
            >
              <Iconify icon={"ph:note-pencil-duotone"} width={24} />
              <Typography variant="subtitle1" fontSize={15}>
                Character
              </Typography>
            </Stack>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "center",
                overflow: "hidden",
                height: 45,
              }}
            >
              <Typography
                color={"inherit"}
                variant={"body2"}
                data-cy="colleague-card-character-area"
                textAlign={"start"}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  maxHeight: 45,
                }}
              >
                {colleague.character}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Typography
          data-cy="colleague-card-generated-by"
          variant="caption"
          component="div"
          noWrap
          sx={{ color: "text.secondary", mb: 1 }}
        >
          Generated By {colleague.AIEngine?.vendor} {colleague.AIEngine?.model}
        </Typography>
      </Card>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="left-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          data-cy="colleague-card-menu-view"
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          data-cy="colleague-card-menu-edit"
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          data-cy="colleague-card-menu-delete"
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </Card>
  );
}
