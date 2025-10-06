import { Iconify } from "@canmingir/link/platform/components";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactEditor } from "slate-react";
import { alpha } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";

const CommandList = ({ commands, onSelect, editor }) => {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (commands.length > 0 && itemRefs.current[0]) {
      itemRefs.current[0].focus();
      setFocusedIndex(0);
    }
  }, [commands]);

  const handleKeyDown = (event) => {
    let newIndex;
    switch (event.key) {
      case "ArrowDown":
        newIndex = (focusedIndex + 1) % commands.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      case "ArrowUp":
        newIndex = (focusedIndex - 1 + commands.length) % commands.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      case "Enter":
        onSelect(commands[focusedIndex]);
        break;
      default:
        ReactEditor.focus(editor);
        break;
    }
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, commands.length);
  }, [commands]);

  return (
    <List
      data-cy="command-dropdown"
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
      {commands.map((command, index) => (
        <ListItem
          data-cy={`command-item-${command.name.split("/")[1]}`}
          key={command.name}
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
          onClick={() => onSelect(command)}
        >
          <ListItemIcon>
            <Iconify width={32} icon={command.icon} />
          </ListItemIcon>
          <ListItemText
            primary={command.name}
            secondary={command.description}
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

export default CommandList;
