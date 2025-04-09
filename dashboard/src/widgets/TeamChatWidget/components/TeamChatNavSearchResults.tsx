import ListItemButton from "@mui/material/ListItemButton";
import { SearchNotFound } from "@nucleoidai/platform/minimal/components";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Typography from "@mui/material/Typography";

function TeamChatNavSearchResults({ query, results, onClickResult }) {
  const totalResults = results.length;

  const notFound = !totalResults && !!query;

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          px: 2.5,
          mb: 2,
        }}
      >
        Contacts ({totalResults})
      </Typography>

      {notFound ? (
        <SearchNotFound
          query={query}
          sx={{
            p: 3,
            mx: "auto",
            width: `calc(100% - 40px)`,
            bgcolor: "background.neutral",
          }}
        />
      ) : (
        <>
          {results.map((result) => (
            <ListItemButton
              key={result.id}
              onClick={() => onClickResult(result)}
              sx={{
                px: 2.5,
                py: 1.5,
                typography: "subtitle2",
              }}
            >
              <SourcedAvatar
                name={result.name}
                source={result.avatarUrl}
                sx={{ mr: 2 }}
              />
              {result.name}
            </ListItemButton>
          ))}
        </>
      )}
    </>
  );
}

export default TeamChatNavSearchResults;
