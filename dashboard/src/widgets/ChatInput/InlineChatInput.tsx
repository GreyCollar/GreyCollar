import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { ResponsibilityCommands } from "../../components/ChatInput/chat.config";
import SourcedAvatar from "../../components/SourcedAvatar/SourcedAvatar";
import { styled } from "@mui/material/styles";
import useColleagues from "../../hooks/useColleagues";
import { withHistory } from "slate-history";

import { BaseEditor, Element as SlateElement, createEditor } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { useCallback, useMemo, useRef, useState } from "react";

const ELEMENT_TYPES = {
  INTEGRATION: "integration",
  PARAGRAPH: "paragraph",
  MENTION: "mention",
} as const;

type CustomElement = {
  type: (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];
  children: CustomText[];
  command?: (typeof ResponsibilityCommands)[number];
  selectedIntegration?: (typeof ResponsibilityCommands)[0]["next"]["list"][number];
  colleague?: {
    id: string;
    name: string;
    avatar: string;
  };
};

type CustomText = {
  text: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const EditorContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  position: "relative",
  display: "flex",
  alignItems: "flex-end",
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`,
  },
}));

const EditorWrapper = styled(Box)({
  flex: 1,
  marginRight: 8,
  '& [contenteditable="true"]': {
    outline: "none",
    boxShadow: "none",
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
  },
});

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  width: 40,
  height: 40,
}));

const CommandList = styled(List)(({ theme }) => ({
  maxHeight: 200,
  width: 200,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

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
}));

const withCommands = (editor: BaseEditor & ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === ELEMENT_TYPES.INTEGRATION ||
      element.type === ELEMENT_TYPES.MENTION
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === ELEMENT_TYPES.INTEGRATION ||
      element.type === ELEMENT_TYPES.MENTION
      ? true
      : isVoid(element);
  };

  return editor;
};

const initialValue: CustomElement[] = [
  {
    type: ELEMENT_TYPES.PARAGRAPH,
    children: [{ text: "" }],
  },
];

interface InlineChatInputProps {
  onSend?: (message: string) => void;
}

const InlineChatInput = ({ onSend }: InlineChatInputProps) => {
  const [value, setValue] = useState<CustomElement[]>(initialValue);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  s;
  const [showMentions, setShowMentions] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<
    (typeof ResponsibilityCommands)[number] | null
  >(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const { colleagues } = useColleagues();

  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useMemo(
    () => withCommands(withHistory(withReact(createEditor()))),
    []
  );

  const handleSend = useCallback(() => {
    const message = value
      .map((node) => {
        if (node.type === ELEMENT_TYPES.PARAGRAPH) {
          return node.children
            .map((child) => {
              if (
                SlateElement.isElement(child) &&
                child.type === ELEMENT_TYPES.INTEGRATION
              ) {
                return (
                  JSON.stringify({
                    type: "INTEGRATION",
                    id: child.selectedIntegration?.id || child.command?.id,
                    icon:
                      child.selectedIntegration?.icon || child.command?.icon,
                  }) + " "
                );
              }
              if (
                SlateElement.isElement(child) &&
                child.type === ELEMENT_TYPES.MENTION
              ) {
                return (
                  JSON.stringify({
                    type: "COLLEAGUE",
                    id: child.colleague?.id,
                  }) + " "
                );
              }
              return child.text;
            })
            .join("");
        }
        return "";
      })
      .join("")
      .trim();

    if (message && onSend) {
      onSend(message);
      setValue(initialValue);
      editor.children = initialValue;
    }
  }, [value, onSend, editor]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "/" && !showCommands) {
        event.preventDefault();
        setShowCommands(true);
        setAnchorEl(event.currentTarget);
      } else if (event.key === "@" && !showMentions) {
        event.preventDefault();
        setShowMentions(true);
        setAnchorEl(event.currentTarget);
      } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (showCommands && selectedOptionIndex) {
          handleCommandSelect(ResponsibilityCommands[selectedOptionIndex]);
        } else if (showIntegrations) {
          handleIntegrationSelect(
            selectedCommand?.next?.list[selectedOptionIndex]
          );
        } else if (showMentions) {
          handleMentionSelect(colleagues[selectedOptionIndex]);
        }

        handleSend();
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        setSelectedOptionIndex(
          event.key === "ArrowUp"
            ? selectedOptionIndex - 1
            : selectedOptionIndex + 1
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCommands, showMentions, handleSend, selectedOptionIndex]
  );

  const handleCommandSelect = useCallback(
    (command) => {
      if (command.type === "integration") {
        setSelectedCommand(command);
        setShowCommands(false);
        setShowIntegrations(true);
      } else {
        const integrationNode: CustomElement = {
          type: ELEMENT_TYPES.INTEGRATION,
          command: command,
          children: [{ text: "" }],
        };

        editor.insertNode(integrationNode);
        setShowCommands(false);
        setAnchorEl(null);
      }
    },
    [editor]
  );

  const handleIntegrationSelect = useCallback(
    (integration) => {
      if (selectedCommand) {
        const integrationNode: CustomElement = {
          type: ELEMENT_TYPES.INTEGRATION,
          command: selectedCommand,
          selectedIntegration: integration,
          children: [{ text: "" }],
        };

        editor.insertNode(integrationNode);
        setShowIntegrations(false);
        setAnchorEl(null);
        setSelectedCommand(null);
      }
    },
    [editor, selectedCommand]
  );

  const handleMentionSelect = useCallback(
    (colleague) => {
      const mentionNode: CustomElement = {
        type: ELEMENT_TYPES.MENTION,
        colleague: {
          id: colleague.id,
          name: colleague.name,
          avatar: colleague.avatar,
        },
        children: [{ text: "" }],
      };

      editor.insertNode(mentionNode);
      setShowMentions(false);
      setAnchorEl(null);
    },
    [editor]
  );

  const renderElement = useCallback((props) => {
    const { element, children, attributes } = props;

    switch (element.type) {
      case ELEMENT_TYPES.INTEGRATION:
        return (
          <IntegrationElement {...attributes}>
            {element.selectedIntegration ? (
              <>
                <Iconify
                  icon={element.selectedIntegration.icon}
                  sx={{ mr: 1 }}
                />
                {element.selectedIntegration.name}
              </>
            ) : (
              <>
                <Iconify icon={element.command?.icon} sx={{ mr: 1 }} />
                {element.command?.label}
              </>
            )}
            {children}
          </IntegrationElement>
        );
      case ELEMENT_TYPES.MENTION:
        return (
          <MentionElement {...attributes}>
            <SourcedAvatar
              name={element.colleague?.name}
              source={"MINIMAL"}
              avatarUrl={element.colleague?.avatar}
              sx={{ mr: 2 }}
            />
            {element.colleague?.name}
            {children}
          </MentionElement>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}>
      <EditorContainer>
        <EditorWrapper>
          <Slate
            ref={inputRef}
            editor={editor}
            initialValue={initialValue}
            onChange={setValue}
          >
            <Editable
              renderElement={renderElement}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
            />
          </Slate>
        </EditorWrapper>
        <SendButton onClick={handleSend} size="small">
          <Iconify icon="mdi:send" />
        </SendButton>
      </EditorContainer>

      <Popover
        open={showCommands}
        anchorEl={anchorEl}
        onClose={() => {
          setShowCommands(false);
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <CommandList>
          {ResponsibilityCommands.map((command) => (
            <ListItem
              key={command.id}
              button
              onClick={() => handleCommandSelect(command)}
            >
              <ListItemIcon>
                <Iconify icon={command.icon} />
              </ListItemIcon>
              <ListItemText
                primary={command.label}
                secondary={command.description}
              />
            </ListItem>
          ))}
        </CommandList>
      </Popover>

      <Popover
        open={showIntegrations}
        anchorEl={anchorEl}
        onClose={() => {
          setShowIntegrations(false);
          setAnchorEl(null);
          setSelectedCommand(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <CommandList>
          {selectedCommand?.next?.list.map((integration) => (
            <ListItem
              key={integration.id}
              button
              onClick={() => handleIntegrationSelect(integration)}
            >
              <ListItemIcon>
                <Iconify icon={integration.icon} />
              </ListItemIcon>
              <ListItemText primary={integration.name} />
            </ListItem>
          ))}
        </CommandList>
      </Popover>

      <Popover
        open={showMentions}
        anchorEl={anchorEl}
        onClose={() => {
          setShowMentions(false);
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <CommandList>
          {colleagues.map((colleague) => (
            <ListItem
              key={colleague.id}
              button
              onClick={() => handleMentionSelect(colleague)}
            >
              <ListItemIcon>
                <SourcedAvatar
                  name={colleague.name}
                  source={"MINIMAL"}
                  avatarUrl={colleague.avatar}
                  sx={{ mr: 2 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={colleague.name}
                secondary={colleague.role}
              />
            </ListItem>
          ))}
        </CommandList>
      </Popover>
    </Box>
  );
};

export default InlineChatInput;
