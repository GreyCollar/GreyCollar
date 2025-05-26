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

import { BaseEditor, Descendant, Node, Transforms, createEditor } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";
import { useCallback, useMemo, useState } from "react";

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
    return (element as CustomElement).type === ELEMENT_TYPES.INTEGRATION ||
      (element as CustomElement).type === ELEMENT_TYPES.MENTION
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) => {
    return (element as CustomElement).type === ELEMENT_TYPES.INTEGRATION ||
      (element as CustomElement).type === ELEMENT_TYPES.MENTION
      ? true
      : isVoid(element);
  };

  return editor;
};

const initialValue: Descendant[] = [
  {
    type: ELEMENT_TYPES.PARAGRAPH,
    children: [{ text: "" }],
  },
];

interface InlineChatInputProps {
  onSend?: (message: string) => void;
}

const InlineChatInput = ({ onSend }: InlineChatInputProps) => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<
    (typeof ResponsibilityCommands)[number] | null
  >(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const { colleagues } = useColleagues();

  const editor = useMemo(
    () => withCommands(withHistory(withReact(createEditor()))),
    []
  );

  const resetEditor = useCallback(() => {
    const point = { path: [0, 0], offset: 0 };

    for (let i = editor.children.length - 1; i >= 0; i--) {
      Transforms.removeNodes(editor, { at: [i] });
    }

    Transforms.insertNodes(editor, initialValue[0], { at: [0] });

    setValue([...initialValue]);

    Transforms.select(editor, {
      anchor: point,
      focus: point,
    });

    ReactEditor.focus(editor);
  }, [editor]);

  const handleSend = useCallback(() => {
    const message = value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((node: any) => {
        if (node.type === ELEMENT_TYPES.PARAGRAPH) {
          return node.children
            .map((child) => {
              if ((child as CustomElement).type === ELEMENT_TYPES.INTEGRATION) {
                return (
                  JSON.stringify({
                    type: "INTEGRATION",
                    id: child.selectedIntegration?.id || child.command?.id,
                    icon:
                      child.selectedIntegration?.icon || child.command?.icon,
                  }) + " "
                );
              }
              if (child.type === ELEMENT_TYPES.MENTION) {
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
      // Use setTimeout to defer the reset until after the current event loop
      setTimeout(() => {
        resetEditor();
      }, 0);
    }
  }, [value, onSend, resetEditor]);

  const handleCommandSelect = useCallback(
    (command: (typeof ResponsibilityCommands)[number]) => {
      if (command.type === "integration") {
        setSelectedCommand(command);
        setShowCommands(false);
        setShowIntegrations(true);
        setSelectedOptionIndex(0);
      } else {
        const integrationNode: CustomElement = {
          type: ELEMENT_TYPES.INTEGRATION,
          command: command,
          children: [{ text: "" }],
        };

        Transforms.insertNodes(editor, integrationNode as unknown as Node);
        setShowCommands(false);
        setAnchorEl(null);
        setSelectedOptionIndex(0);
      }
    },
    [editor]
  );

  const handleIntegrationSelect = useCallback(
    (
      integration: (typeof ResponsibilityCommands)[0]["next"]["list"][number]
    ) => {
      if (selectedCommand) {
        const integrationNode: CustomElement = {
          type: ELEMENT_TYPES.INTEGRATION,
          command: selectedCommand,
          selectedIntegration: integration,
          children: [{ text: "" }],
        };

        Transforms.insertNodes(editor, integrationNode as unknown as Node);
        setShowIntegrations(false);
        setAnchorEl(null);
        setSelectedCommand(null);
        setSelectedOptionIndex(0);
      }
    },
    [editor, selectedCommand]
  );

  const handleMentionSelect = useCallback(
    (colleague: CustomElement["colleague"]) => {
      const mentionNode: CustomElement = {
        type: ELEMENT_TYPES.MENTION,
        colleague: {
          id: colleague.id,
          name: colleague.name,
          avatar: colleague.avatar,
        },
        children: [{ text: "" }],
      };

      Transforms.insertNodes(editor, mentionNode as unknown as Node);
      setShowMentions(false);
      setAnchorEl(null);
      setSelectedOptionIndex(0);
    },
    [editor]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "/" && !showCommands) {
        event.preventDefault();
        setShowCommands(true);
        setAnchorEl(event.currentTarget as HTMLElement);
      } else if (event.key === "@" && !showMentions) {
        event.preventDefault();
        setShowMentions(true);
        setAnchorEl(event.currentTarget as HTMLElement);
      } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (showCommands && selectedOptionIndex !== null) {
          handleCommandSelect(ResponsibilityCommands[selectedOptionIndex]);
          return;
        } else if (
          showIntegrations &&
          selectedCommand?.next?.list[selectedOptionIndex]
        ) {
          handleIntegrationSelect(
            selectedCommand.next.list[selectedOptionIndex]
          );
          return;
        } else if (showMentions && colleagues[selectedOptionIndex]) {
          handleMentionSelect(colleagues[selectedOptionIndex]);
          return;
        }

        handleSend();
      } else if (event.key === "Escape") {
        setShowCommands(false);
        setShowIntegrations(false);
        setShowMentions(false);
        setAnchorEl(null);
        setSelectedCommand(null);
        setSelectedOptionIndex(0);
      } else if (
        (event.key === "ArrowUp" || event.key === "ArrowDown") &&
        (showCommands || showIntegrations || showMentions)
      ) {
        event.preventDefault();
        let maxIndex = 0;

        if (showCommands) {
          maxIndex = ResponsibilityCommands.length - 1;
        } else if (showIntegrations && selectedCommand?.next?.list) {
          maxIndex = selectedCommand.next.list.length - 1;
        } else if (showMentions) {
          maxIndex = colleagues.length - 1;
        }

        if (event.key === "ArrowUp") {
          setSelectedOptionIndex((prev) => Math.max(0, prev - 1));
        } else {
          setSelectedOptionIndex((prev) => Math.min(maxIndex, prev + 1));
        }
      }
    },
    [
      showCommands,
      showMentions,
      showIntegrations,
      handleSend,
      selectedOptionIndex,
      colleagues,
      selectedCommand,
      handleCommandSelect,
      handleIntegrationSelect,
      handleMentionSelect,
    ]
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    const { element, children, attributes } = props as {
      element: CustomElement;
      children: React.ReactNode;
      attributes: React.HTMLAttributes<HTMLElement>;
    };

    switch ((element as CustomElement).type) {
      case ELEMENT_TYPES.INTEGRATION:
        return (
          <IntegrationElement {...attributes} contentEditable={false}>
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
          <MentionElement {...attributes} contentEditable={false}>
            <SourcedAvatar
              name={element.colleague?.name}
              source={"MINIMAL"}
              avatarUrl={element.colleague?.avatar}
              sx={{ mr: 0.5, width: 20, height: 20 }}
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
          setSelectedOptionIndex(0);
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
          {ResponsibilityCommands.map((command, index) => (
            <ListItem
              key={command.id}
              button
              selected={index === selectedOptionIndex}
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
          setSelectedOptionIndex(0);
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
          {selectedCommand?.next?.list.map((integration, index) => (
            <ListItem
              key={integration.id}
              button
              selected={index === selectedOptionIndex}
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
          setSelectedOptionIndex(0);
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
          {colleagues.map((colleague, index) => (
            <ListItem
              key={colleague.id}
              button
              selected={index === selectedOptionIndex}
              onClick={() => handleMentionSelect(colleague)}
            >
              <ListItemIcon>
                <SourcedAvatar
                  name={colleague.name}
                  source={"MINIMAL"}
                  avatarUrl={colleague.avatar}
                  sx={{ width: 32, height: 32 }}
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
