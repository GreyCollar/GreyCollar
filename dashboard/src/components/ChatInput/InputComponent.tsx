import { Iconify } from "@canmingir/link/platform/components";
import InlineChromiumBugfix from "./InlineChromiumBugFix";
import { ReactEditor } from "slate-react";
import SourcedAvatar from "../SourcedAvatar/SourcedAvatar";
import { css } from "@emotion/css";

import { Editor, Transforms } from "slate";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { TextField, alpha, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const InputComponent = ({
  attributes,
  children,
  element,
  editor,
  handleSend,
}) => {
  const textFieldRef = useRef(null);

  const options = element?.options ?? [];

  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (element.getInputValue) {
      element.getInputValue(e.target.value);
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "Tab": {
        event.preventDefault();
        ReactEditor.focus(editor);
        const point = Editor.end(editor, []);
        Transforms.select(editor, point);
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        setFocusedIndex(0);
        const newIndex = (focusedIndex + 1) % options.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      }
      case "ArrowUp": {
        const newIndex = (focusedIndex - 1 + options.length) % options.length;
        setFocusedIndex(newIndex);
        if (itemRefs.current[newIndex]) {
          itemRefs.current[newIndex].focus();
        }
        break;
      }
      case "Enter": {
        event.preventDefault();
        handleSend();
        if (focusedIndex >= 0) {
          handleOptionSelect(options[focusedIndex]);
        } else if (element.getInputValue) {
          element.getInputValue(inputValue);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
    // eslint-disable-next-line
  }, [focusedIndex]);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.select();
    }
  }, []);

  const handleOptionSelect = (option) => {
    element.onSelect(option);
    setInputValue(option.name);
    setDisabled(true);
  };

  const Dropdown = ({ options, onSelect }) => {
    const handleKeyDown = (event) => {
      let newIndex;
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex(0);
          newIndex = (focusedIndex + 1) % options.length;

          setFocusedIndex(newIndex);
          if (itemRefs.current[newIndex]) {
            itemRefs.current[newIndex].focus();
          }
          break;
        case "ArrowUp":
          newIndex = (focusedIndex - 1 + options.length) % options.length;
          setFocusedIndex(newIndex);
          if (itemRefs.current[newIndex]) {
            itemRefs.current[newIndex].focus();
          }
          break;
        case "Enter":
          event.preventDefault();
          console.log("FOCUSED INDEX", focusedIndex);
          handleOptionSelect(options[focusedIndex]);
          break;
        default:
          textFieldRef.current.focus();
          textFieldRef.current.select();
          break;
      }
    };

    useEffect(() => {
      itemRefs.current = itemRefs.current.slice(0, options.length);
    }, [options]);

    return (
      <>
        <List
          onKeyDown={handleKeyDown}
          data-cy="input-dropdown"
          disablePadding
          ref={listRef}
          tabIndex={-1}
          sx={{
            position: "absolute",
            bottom: "120%",
            left: 0,
            right: 0,
            backgroundColor: alpha(theme.palette.background.neutral, 1),
            border: "1px 1px 0px 1px solid #202225",
            borderRadius: "5px",
            width: "100%",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {options.map((option, index) => (
            <ListItem
              ref={(el) => (itemRefs.current[index] = el)}
              tabIndex={-1}
              key={index}
              onClick={() => onSelect(option)}
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
              data-cy={`input-item-${option.name}`}
            >
              <ListItemAvatar>
                {option.icon ? (
                  <Iconify
                    icon={option?.icon}
                    width={36}
                    style={{ marginTop: "5px" }}
                  />
                ) : (
                  <SourcedAvatar source={"MINIMAL"} avatarUrl={option.avatar} />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={option.name}
                primaryTypographyProps={{ fontWeight: "bold" }}
                secondary={option.role}
                secondaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#91959c",
                  className: "command-description",
                }}
                sx={{ ml: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  return (
    <span
      {...attributes}
      contentEditable={false}
      className={css`
        background-color: ${alpha(theme.palette.background.neutral, 0.1)};
        color: white;
        border-radius: 5px 8px 8px 5px;
        padding: 0 0.5rem;
        font-size: 0.9rem;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        margin-right: 0.3rem;
        height: 22px;
      `}
    >
      <InlineChromiumBugfix />
      {options && !disabled && (
        <Dropdown
          options={filteredOptions || []}
          onSelect={(option) => {
            handleOptionSelect(option);
          }}
        />
      )}

      {children}
      <TextField
        data-cy="input-component"
        inputRef={textFieldRef}
        variant="filled"
        hiddenLabel
        sx={{
          width: "150px",
          marginLeft: "0.5rem",
          marginRight: "-8px",
          "& .MuiInputBase-hiddenLabel": {
            height: "20px",
          },
        }}
        size="small"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      <InlineChromiumBugfix />
    </span>
  );
};

export default InputComponent;
