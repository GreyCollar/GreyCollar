import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ReactEditor } from "slate-react";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { alpha } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";

const MentionList = ({ colleagues, onSelect, editor }) => {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (colleagues.length > 0 && itemRefs.current[0]) {
      itemRefs.current[0].focus();
      setFocusedIndex(0);
    }
  }, [colleagues]);

  const handleKeyDown = (event) => {
    let newIndex;
    switch (event.key) {
      case "ArrowDown":
        newIndex = (focusedIndex + 1) % colleagues.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      case "ArrowUp":
        newIndex = (focusedIndex - 1 + colleagues.length) % colleagues.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      case "Enter":
        event.preventDefault();
        onSelect(colleagues[focusedIndex]);
        break;
      default:
        ReactEditor.focus(editor);
        break;
    }
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, colleagues.length);
  }, [colleagues]);

  return (
    <List
      data-cy="colleague-mention-dropdown"
      disablePadding
      ref={listRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.background.neutral, 1),
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        border: "1px 1px 0px 1px solid #202225",
        borderRadius: "5px",
        width: "100%",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {colleagues.map((colleague, index) => (
        <ListItem
          data-cy={`command-item-${colleague.name.split("/")[1]}`}
          key={colleague.name}
          ref={(el) => (itemRefs.current[index] = el)}
          tabIndex={-1}
          sx={{
            bgcolor: "#313438",
            "&:focus, &:hover": {
              bgcolor: "inherit",
              color: "black",
            },
            cursor: "pointer",
            "&:hover .command-description, &:focus .command-description": {
              color: "black",
            },
          }}
          onClick={() => onSelect(colleague)}
        >
          <SourcedAvatar
            name={colleague.name}
            source={"MINIMAL"}
            avatarUrl={colleague.avatar}
            sx={{ mr: 2 }}
          />
          <ListItemText
            primary={colleague.name}
            secondary={colleague.role}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondaryTypographyProps={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#91959c",
              className: "command-description",
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MentionList;
