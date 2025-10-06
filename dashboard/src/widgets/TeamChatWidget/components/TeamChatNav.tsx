import { AvatarGroup } from "@mui/material";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ColleagueCard from "../../../components/ColleagueCard";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SourcedAvatar from "../../../components/SourcedAvatar/SourcedAvatar";
import Stack from "@mui/material/Stack";
import TeamChatNavAccount from "./TeamChatNavAccount";
import TeamChatNavItem from "./TeamChatNavItem";
import TeamChatNavItemSkeleton from "./TeamChatSkeleton";
import TeamChatNavSearchResults from "./TeamChatNavSearchResults";
import TextField from "@mui/material/TextField";
import { publish } from "@nucleoidai/react-event";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { Iconify, Scrollbar } from "@canmingir/link/platform/components";
import { useCallback, useEffect, useState } from "react";

const NAV_COLLAPSE_WIDTH = 96;

function TeamChatNav({ loading, colleagues, collapsed, setCollapsed }) {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const NAV_WIDTH = mdDown ? "100%" : 300;

  const navigate = useNavigate();

  const mdUp = true;
  const [colleagueCardDialogOpen, setColleagueCardDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleColleagueClick = (colleague) => {
    setSelectedMember(colleague);
    setColleagueCardDialogOpen(true);
  };

  const handleColleagueView = (colleague) => {
    navigate(`/colleagues/${colleague.id}`);
  };

  const [searchContacts, setSearchContacts] = useState({
    query: "",
    results: [],
  });

  useEffect(() => {
    if (!mdUp) {
      setCollapsed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdUp]);

  useEffect(() => {
    if (lgUp) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const handleToggleNav = () => {
    setCollapsed(!collapsed);
  };

  const handleSearchContacts = useCallback(
    (inputValue) => {
      setSearchContacts((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = colleagues.filter((colleague) =>
          colleague.name.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [colleagues]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({
      query: "",
      results: [],
    });
  }, []);

  const handleClickResult = useCallback(
    (result) => {
      handleClickAwaySearch();
      console.log("clicked result: ", result);
    },
    [handleClickAwaySearch]
  );

  const renderSkeleton = (
    <>
      {[...Array(12)].map((_, index) => (
        <TeamChatNavItemSkeleton sx={""} key={index} />
      ))}
    </>
  );

  const renderList = (
    <Stack flexDirection={collapsed && mdDown ? "row" : "column"}>
      {colleagues.map((member) => (
        <TeamChatNavItem
          key={member.id}
          member={member}
          collapse={collapsed}
          selected={false}
          onClick={handleColleagueClick}
        />
      ))}

      {collapsed && mdDown && (
        <AvatarGroup max={4} sx={{ ml: 1 }}>
          {colleagues.map((member) => {
            const { id, name, avatar } = member;
            return (
              <SourcedAvatar
                key={id}
                name={name}
                source={"MINIMAL"}
                avatarUrl={avatar}
                sx={{ width: 36, height: 36 }}
              />
            );
          })}
        </AvatarGroup>
      )}
    </Stack>
  );

  const renderListResults = (
    <TeamChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search Colleagues..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ pt: 2 }}
      >
        {!lgUp && (
          <IconButton
            data-cy="open-nav-button"
            onClick={() =>
              publish("PLATFORM_NAV_OPENED", { layout: "fullScreen" })
            }
          >
            <Iconify icon="mingcute:menu-fill" sx={{ width: 28, height: 28 }} />
          </IconButton>
        )}

        {!collapsed && (
          <>
            <TeamChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav} data-cy="mobile-menu">
          <Iconify
            icon={
              collapsed
                ? "eva:arrow-ios-forward-fill"
                : "eva:arrow-ios-back-fill"
            }
            sx={{
              transform: mdDown ? "rotate(90deg)" : "none",
            }}
          />
        </IconButton>
      </Stack>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapsed && renderSearchInput}</Box>

      <Scrollbar sx={{ pt: 2 }}>
        {searchContacts.query && renderListResults}

        {loading && renderSkeleton}

        {!searchContacts.query && renderList}
      </Scrollbar>
    </>
  );

  return (
    <>
      {mdDown && !collapsed ? (
        <Drawer
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: "100%", height: "100%" },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Stack
          sx={
            mdDown
              ? {
                  width: "100%",
                  height: 30,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }
              : {
                  height: 1,
                  flexShrink: 0,
                  width: collapsed ? NAV_COLLAPSE_WIDTH : NAV_WIDTH,
                  borderRight: `solid 1px ${theme.palette.divider}`,
                  transition: theme.transitions.create(["width"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                }
          }
        >
          {renderContent}
        </Stack>
      )}
      <Dialog
        open={colleagueCardDialogOpen}
        onClose={() => setColleagueCardDialogOpen(false)}
      >
        <ColleagueCard
          colleague={selectedMember}
          onView={() => handleColleagueView(selectedMember)}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </Dialog>
    </>
  );
}

export default TeamChatNav;
