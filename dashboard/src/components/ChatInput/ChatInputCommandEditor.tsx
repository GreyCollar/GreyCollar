import "../../styles/chat.css";

import { BaseEditor } from "slate";
import CommandList from "./CommandList";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import MentionList from "./MentionList";
import MentionText from "./MentiontText";
import { isKeyHotkey } from "is-hotkey";
import useColleagues from "../../hooks/useColleagues";
import { useEvent } from "@nucleoidai/react-event";
import { useLocation } from "react-router-dom";

import { Alert, Box, Collapse, IconButton } from "@mui/material";
import {
  CommandComponent,
  CommandText,
  InputComponent,
  OptionalBadge,
  Text,
} from ".";
import { Editable, ReactEditor } from "slate-react";
import { Editor, Range, Transforms } from "slate";
import React, { useCallback, useEffect, useState } from "react";

import * as SlateReact from "slate-react";

type CustomElement = {
  type?:
    | "input"
    | "commandText"
    | "mention"
    | "label"
    | "optional"
    | "paragraph";
  children: {
    text: string;
    colleagueId?: string;
    type?: string;
    children?: { text: string }[];
  }[];
  options?: { name: string; id?: string }[];
  onSelect?: (selected: { name: string; id?: string }) => void;
  getInputValue?: (value: string) => void;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: CustomElement;
  }
}

const ChatInputCommandEditor = ({
  onKeyUp,
  onChange,
  placeholder,
  startAdornment,
  endAdornment,
  sx,
  chatCommands,
  editor,
  createMessage,
  userId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [currentInput, setCurrentInput] = useState(null);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [mentionOpen, setMentionOpen] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const { colleagues } = useColleagues();

  const [readOnly, setReadOnly] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (currentInput && currentInput.type !== "ANSWER") {
      startCommandStory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput]);

  const selectedColleague =
    location.state?.name || sessionStorage.getItem("name");

  useEffect(() => {
    sessionStorage.removeItem("name");
  }, [selectedColleague]);

  const insertCommand = (selectedCommand) => {
    const command: CustomElement = {
      type: "commandText",
      children: [{ text: selectedCommand }],
    };

    Transforms.insertNodes(editor, command);
  };

  const insertMention = (mentionName, colleagueId) => {
    const mention: CustomElement = {
      type: "mention",
      children: [
        {
          text: `@${mentionName}`,
          colleagueId: colleagueId,
        },
      ],
    };
    Transforms.insertNodes(editor, mention);
    const endOfMention = Editor.end(editor, []);
    Transforms.select(editor, endOfMention);
  };

  const handleCommandSelect = (command) => {
    console.log(command, "command");
    setSelectedCommand(command);
    insertCommand(command.name);
  };

  const startCommandStory = () => {
    setCurrentInput((prev) => prev.next);
    if (currentInput.type === "DROPDOWN") {
      Transforms.insertNodes(editor, {
        type: "input",
        options: currentInput.list,
        onSelect: (selectedOption) => {
          console.log(selectedOption, "selectedOption");
          if (!selectedOption || !selectedOption.name) return;

          const selectedInput = currentInput.action(selectedOption.name);
          if (!selectedInput || !currentInput.next[selectedInput]) return;

          Transforms.insertNodes(editor, {
            type: "input",
            children: [{ text: currentInput.next[selectedInput].type }],
            getInputValue: (inputValue) => {
              if (!inputValue) return;
              handleInputSubmit(
                currentInput.next[selectedInput].type,
                inputValue
              );
            },
          });
          setCurrentInput(currentInput.next[selectedInput].next);
        },
        children: [{ text: currentInput.label }],
      });
    } else if (
      currentInput.type === "TEXT" ||
      currentInput.type === "URL" ||
      currentInput.type === "QA" ||
      currentInput.type === "ANSWER"
    ) {
      Transforms.insertNodes(editor, {
        type: "input",
        children: [{ text: currentInput.label }],
        getInputValue: (inputValue) => {
          handleInputSubmit(currentInput.type, inputValue);
        },
      });
    }
  };

  const onKeyDown = (event) => {
    const { selection } = editor;

    if (event.key === "Backspace") {
      const end = Editor?.end(editor, []);
      Transforms.select(editor, end);
    }

    if (event.key === "Tab") {
      event.preventDefault();

      if (currentInput !== undefined && selectedCommand) {
        startCommandStory();
      }
    }

    if (event.key === "Enter") {
      if (!currentInput) {
        event.preventDefault();
        handleSend();
      } else if (selectedCommand && currentInput) {
        event.preventDefault();
        startCommandStory();
      }
    }

    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey("left", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }
      if (isKeyHotkey("right", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset" });
        return;
      }
    }

    onKeyUp &&
      onKeyUp({
        target: {
          value: editor.children[0]?.children.text,
        },
      });
  };

  const input = new Map();
  const [inputValue, setInputValue] = useState([]);

  const initialValue: CustomElement[] = selectedColleague
    ? [
        {
          type: "paragraph",
          children: [
            {
              text: "",
            },
            {
              text: `@${selectedColleague}`,
              type: "mention",
              colleagueId: selectedColleague,
            },
          ],
        },
      ]
    : [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];

  const [messagesLoaded] = useEvent("MESSAGES_LOADED", null);
  const [knowledgeStatus] = useEvent("KNOWLEDGE_STATUS_CHANGED", null);

  const clearEditor = useCallback(
    () => {
      Transforms.delete(editor, { at: [0], unit: "block" });
      Transforms.insertNodes(editor, initialValue[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor]
  );

  useEffect(
    () => {
      clearEditor();
      setReadOnly(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messagesLoaded, knowledgeStatus]
  );

  const handleSend = () => {
    const content = editor?.children[0]?.children;

    if (!content || content.length === 0) {
      return;
    }

    // Handle simple paragraph text
    if (content.length === 1 && content[0].text) {
      onKeyUp({ key: "Enter", target: { value: content[0].text } });
      clearEditor();
      return;
    }

    const text = content[0].text;
    const isItCommand = !text && content[1]?.type === "commandText";
    const isMention = content[1]?.type === "mention";

    setReadOnly(true);

    if (isItCommand) {
      input.set("NAME", selectedCommand.name);
      inputValue.forEach((inputVal) => {
        input.set(inputVal.type, inputVal.value);
      });

      onKeyUp({
        key: "Enter",
        target: { value: input },
      });

      setSelectedCommand(null);
      setCurrentInput(null);
      setInputValue([]);
    } else if (isMention) {
      const messageContent = content
        .map((node) => {
          if (node.type === "mention") {
            return `@{ colleagueId: '${node.children[0].colleagueId}', name: '${node.children[0].text}' }`;
          }
          return node.text;
        })
        .join(" ")
        .trim();

      const messageArray = {
        role: "USER",
        userId: userId.toString(),
        content: messageContent,
      };

      createMessage(messageArray);
    } else {
      onKeyUp({ key: "Enter", target: { value: text } });
    }

    clearEditor();
  };

  const handleInputSubmit = (type, value) => {
    setInputValue([...inputValue, { type, value }]);
  };

  const handleChange = (event) => {
    if (!event || !event[0] || !event[0].children) return;
    
    let types = event[0]?.children
      .map((child) => child.type)
      .filter((type) => typeof type === "string");

    const sentence = event[0].children[0]?.text || "";
    const sentenceNode = editor.children[0];
    
    if (sentence.startsWith("/")) {
      setDropdownOpen(true);

      setFilteredCommands(
        chatCommands.filter((command) => {
          return command.name.toLowerCase().includes(sentence.toLowerCase());
        })
      );

      if (types.find((type) => type === "commandText")) {
        setDropdownOpen(false);

        const path = ReactEditor.findPath(editor, sentenceNode.children[0]);

        Transforms.removeNodes(editor, { at: path });

        ReactEditor.focus(editor);
        Transforms.insertText(editor, " ", { at: Editor.end(editor, []) });

        const endOfDocument = Editor.end(editor, []);

        Transforms.select(editor, endOfDocument);

        const firstInput = selectedCommand.next;

        if (firstInput.type === "COLLEAGUE") {
          Transforms.insertNodes(editor, {
            type: "input",
            options: colleagues,
            onSelect: (colleague) => {
              handleInputSubmit("COLLEAGUE", colleague);
              setCurrentInput(firstInput.next);
            },
            children: [{ text: "Select a Colleague" }],
          });
        } else if (firstInput.type === "INTEGRATION") {
          Transforms.insertNodes(editor, {
            type: "input",
            options: firstInput.list,
            onSelect: (option) => {
              console.log(option, "option");
              handleInputSubmit(firstInput.action(option.name), option.name);
            },
            children: [{ text: firstInput.label }],
          });
        }
        Transforms.insertText(editor, " ", { at: Editor.end(editor, []) });
      }
    } else if (sentence.includes("@")) {
      setMentionOpen(true);

      const atIndex = sentence.indexOf("@");
      const beforeText = sentence.slice(0, atIndex);
      const afterText = sentence.slice(atIndex + 1);

      if (types.find((type) => type === "mention")) {
        setMentionOpen(false);
        const path = ReactEditor.findPath(editor, sentenceNode.children[0]);

        Transforms.removeNodes(editor, { at: path });

        Transforms.insertText(editor, beforeText, {
          at: Editor.end(editor, path),
        });
        Transforms.insertText(editor, " ", { at: Editor.end(editor, []) });
        Transforms.insertText(editor, afterText, {
          at: Editor.end(editor, []),
        });
      }
    } else {
      types = [];
      setDropdownOpen(false);
      setMentionOpen(false);
    }

    onChange && onChange(event);
  };

  const handleMentionSelect = (mention) => {
    insertMention(mention.name, mention.id);
    setMentionOpen(false);
    ReactEditor.focus(editor);
  };

  return (
    <>
      <Collapse in={showAlert}>
        <Alert
          severity="error"
          hidden={!showAlert}
          variant="outlined"
          sx={{ width: "100%", marginBottom: "10px" }}
          onClose={() => {
            setShowAlert(false);
          }}
        >
          Please complete the command story.
        </Alert>
      </Collapse>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          ...sx,
        }}
      >
        {startAdornment && (
          <div style={{ marginRight: "10px" }}>{startAdornment}</div>
        )}
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            width: "100%",
          }}
        >
          <SlateReact.Slate
            data-cy="slate"
            editor={editor}
            initialValue={initialValue}
            onChange={handleChange}
          >
            <Editable
              data-cy="message-input"
              renderElement={(props) => (
                <Element {...props} editor={editor} handleSend={handleSend} />
              )}
              renderLeaf={(props) => <Text {...props} />}
              onKeyDown={onKeyDown}
              readOnly={readOnly}
              style={{
                outline: "none",
                color: readOnly ? "#bdbdbd" : "white",
                width: "100%",
              }}
              placeholder={placeholder}
            />

            {mentionOpen && (
              <MentionList
                colleagues={colleagues}
                onSelect={handleMentionSelect}
                editor={editor}
              />
            )}

            {dropdownOpen && (
              <CommandList
                commands={filteredCommands}
                onSelect={handleCommandSelect}
                editor={editor}
              />
            )}
          </SlateReact.Slate>
        </div>
        {endAdornment && (
          <div style={{ marginLeft: "10px" }}>{endAdornment}</div>
        )}
        <IconButton
          data-cy="send-button"
          onClick={() => {
            if (!currentInput) {
              handleSend();
            } else if (selectedCommand && currentInput) {
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
              }, 2000);
            }
          }}
          color={!currentInput && selectedCommand ? "primary" : "default"}
        >
          <Iconify icon={"material-symbols:send"} width={24} />
        </IconButton>
      </Box>
    </>
  );
};

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "label":
      return <CommandComponent {...props} />;
    case "input":
      return <InputComponent {...props} />;
    case "commandText":
      return <CommandText {...props} />;
    case "optional":
      return <OptionalBadge {...props} />;
    case "mention":
      return <MentionText {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default ChatInputCommandEditor;
