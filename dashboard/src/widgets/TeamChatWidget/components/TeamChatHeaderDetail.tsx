import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "@canmingir/link/platform/components";
import Typography from "@mui/material/Typography";

function TeamChatHeaderDetail({ title, mdDown }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      width="100%"
      data-cy="chat-header-detail"
    >
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <IconButton
        sx={{
          marginBottom: mdDown ? "30px" : "0",
          marginTop: mdDown ? "0" : "10px",
        }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Box>
  );
}

export default TeamChatHeaderDetail;
