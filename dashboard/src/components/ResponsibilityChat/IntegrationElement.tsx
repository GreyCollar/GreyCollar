import { Box } from "@mui/material";
import { styled } from "@mui/material";

const IntegrationElement = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: "2px 8px",
  borderRadius: theme.shape.borderRadius,
  margin: "0 2px",
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
  },
}));

const MentionElement = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  padding: "2px 8px",
  borderRadius: theme.shape.borderRadius,
  margin: "0 2px",
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
  },
const IntegrationScopeElement = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
  padding: "2px 4px 2px 2px",
  borderRadius: theme.shape.borderRadius,
  margin: "0 4px 0 4px",
  "& .MuiTypography-root": {
    fontSize: "0.4rem",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "0.8rem",
  },
}));

export { IntegrationElement, MentionElement };
