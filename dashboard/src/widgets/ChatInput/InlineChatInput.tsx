import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "@canmingir/link/minimal/components";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { ResponsibilityCommands } from "../../components/ChatInput/chat.config";
import SourcedAvatar from "../../components/SourcedAvatar/SourcedAvatar";
import useColleagues from "../../hooks/useColleagues";
import { withHistory } from "slate-history";

import {
  BaseEditor,
  Descendant,
  Editor,
  Element,
  Node,
  Text,
  Transforms,
  createEditor,
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";
import {
  IntegrationElement,
  MentionElement,
} from "../../components/ResponsibilityChat/IntegrationElement";
import { styled, useTheme } from "@mui/material/styles";
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
  selectedScope?: {
    id: string;
    name: string;
    icon: string;
  };
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
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default}80 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  height: theme.spacing(6),
  position: "relative",
  display: "flex",
  alignItems: "center",
  backdropFilter: "blur(10px)",
  transition: "all 0.2s ease-in-out",
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}05 100%)`,
  },
  "&:hover": {
    borderColor: theme.palette.primary.main + "60",
  },
}));

const EditorWrapper = styled(Box)({
  padding: "8px 12px",
  flex: 1,
  marginRight: 8,
  '& [contenteditable="true"]': {
    outline: "none",
    boxShadow: "none",
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    minHeight: "20px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
});

const SendButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  border: `1px solid ${theme.palette.primary.main}20`,
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    borderColor: theme.palette.primary.main + "40",
  },
  "&:disabled": {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  width: 36,
  height: 36,
  alignSelf: "center",
  borderRadius: 2,
  transition: "all 0.2s ease-in-out",
}));

const CommandList = styled(List)(({ theme }) => ({
  maxHeight: 200,
  width: 250,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: "hidden",
  "& .MuiListItem-root": {
    borderRadius: 0,
    transition: "all 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "08",
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main + "12",
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "16",
      },
    },
  },
}));

const IntegrationScopeElement = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  height: "20px",
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
  padding: "2px",
  borderRadius: theme.shape.borderRadius,
  marginLeft: "10px",
  "& .MuiTypography-root": {
    fontSize: "0.4rem",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "0.8rem",
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
  const theme = useTheme();
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showScopes, setShowScopes] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<
    (typeof ResponsibilityCommands)[number] | null
  >(null);
  const [selectedIntegration, setSelectedIntegration] = useState<
    (typeof ResponsibilityCommands)[0]["next"]["list"][number] | null
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
      .map((node) => {
        if (Element.isElement(node) && node.type === ELEMENT_TYPES.PARAGRAPH) {
          return node.children
            .map((child) => {
              if (
                Element.isElement(child) &&
                (child as CustomElement).type === ELEMENT_TYPES.INTEGRATION
              ) {
                const customChild = child as CustomElement;
                const integrationData: {
                  type: "INTEGRATION";
                  id: string | undefined;
                  name: string | undefined;
                  icon: string | undefined;
                  scope?: {
                    id: string;
                    name: string;
                    icon: string;
                  };
                } = {
                  type: "INTEGRATION",
                  id:
                    customChild.selectedIntegration?.id ||
                    customChild.command?.id,
                  name:
                    customChild.selectedIntegration?.name ||
                    customChild.command?.label,
                  icon:
                    customChild.selectedIntegration?.icon ||
                    customChild.command?.icon,
                };

                if (customChild.selectedScope) {
                  integrationData.scope = {
                    id: customChild.selectedScope.id,
                    name: customChild.selectedScope.name,
                    icon: customChild.selectedScope.icon,
                  };
                }
                return JSON.stringify(integrationData);
              }
              if (
                Element.isElement(child) &&
                (child as CustomElement).type === ELEMENT_TYPES.MENTION
              ) {
                const customChild = child as CustomElement;
                return JSON.stringify({
                  type: "COLLEAGUE",
                  id: customChild.colleague?.id,
                });
              }
              return Text.isText(child) ? child.text : "";
            })
            .join(" ");
        }
        return "";
      })
      .join("")
      .trim();

    if (message && onSend) {
      onSend(message);
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
      setSelectedIntegration(integration);

      const integrationNode: CustomElement = {
        type: ELEMENT_TYPES.INTEGRATION,
        command: selectedCommand,
        selectedIntegration: integration,
        children: [{ text: "" }],
      };

      Transforms.insertNodes(editor, integrationNode as unknown as Node);

      Transforms.move(editor);

      if (integration.next && integration.next.list) {
        setShowIntegrations(false);
        setShowScopes(true);
        setSelectedOptionIndex(0);
        return;
      }

      setShowIntegrations(false);
      setAnchorEl(null);
      setSelectedCommand(null);
      setSelectedIntegration(null);
      setSelectedOptionIndex(0);
    },
    [editor, selectedCommand]
  );

  const handleScopeSelect = useCallback(
    (scope) => {
      if (selectedIntegration) {
        const { selection } = editor;
        if (selection) {
          const before = Editor.before(editor, selection.anchor);
          if (before) {
            const [match] = Editor.nodes(editor, {
              at: before,
              match: (n) =>
                (n as CustomElement).type === ELEMENT_TYPES.INTEGRATION,
            });

            if (match) {
              const [, path] = match;
              Transforms.setNodes(
                editor,
                { selectedScope: scope } as Partial<CustomElement>,
                {
                  at: path,
                }
              );
            }
          }
        }

        setShowScopes(false);
        setAnchorEl(null);
        setSelectedCommand(null);
        setSelectedIntegration(null);
        setSelectedOptionIndex(0);
        Transforms.move(editor);
        Transforms.insertText(editor, " ");
        ReactEditor.focus(editor);
      }
    },
    [editor, selectedIntegration]
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
        } else if (
          showScopes &&
          selectedIntegration?.next?.list &&
          selectedOptionIndex !== null
        ) {
          // Handle the scope selection
          const scope =
            typeof selectedIntegration.next.list === "object" &&
            !Array.isArray(selectedIntegration.next.list)
              ? selectedIntegration.next.list
              : Array.isArray(selectedIntegration.next.list)
              ? selectedIntegration.next.list[selectedOptionIndex]
              : null;

          if (scope) {
            handleScopeSelect(scope);
          }
          return;
        } else if (showMentions && colleagues[selectedOptionIndex]) {
          handleMentionSelect(colleagues[selectedOptionIndex]);
          return;
        }

        handleSend();
      } else if (event.key === "Escape") {
        setShowCommands(false);
        setShowIntegrations(false);
        setShowScopes(false);
        setShowMentions(false);
        setAnchorEl(null);
        setSelectedCommand(null);
        setSelectedIntegration(null);
        setSelectedOptionIndex(0);
      } else if (
        (event.key === "ArrowUp" || event.key === "ArrowDown") &&
        (showCommands || showIntegrations || showScopes || showMentions)
      ) {
        event.preventDefault();
        let maxIndex = 0;

        if (showCommands) {
          maxIndex = ResponsibilityCommands.length - 1;
        } else if (showIntegrations && selectedCommand?.next?.list) {
          maxIndex = selectedCommand.next.list.length - 1;
        } else if (showScopes && selectedIntegration?.next?.list) {
          maxIndex = Array.isArray(selectedIntegration.next.list)
            ? selectedIntegration.next.list.length - 1
            : 0;
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
      showScopes,
      handleSend,
      selectedOptionIndex,
      colleagues,
      selectedCommand,
      selectedIntegration,
      handleCommandSelect,
      handleIntegrationSelect,
      handleScopeSelect,
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
            {element.selectedScope && (
              <IntegrationScopeElement>
                <Iconify icon={element.selectedScope.icon} sx={{ mr: 1 }} />
                {element.selectedScope.name}
              </IntegrationScopeElement>
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

  const getIsEmpty = () => {
    return value.every((node) => {
      if (Element.isElement(node) && node.type === ELEMENT_TYPES.PARAGRAPH) {
        return node.children.every(
          (child) => Text.isText(child) && child.text.trim() === ""
        );
      }
      return false;
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        p: { xs: 1, sm: 1.5, md: 2 },
      }}
    >
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
              placeholder="Type a message..."
              style={{
                color: theme.palette.text.primary,
              }}
            />
          </Slate>
        </EditorWrapper>
        <SendButton
          onClick={handleSend}
          size="small"
          sx={{ mr: 1 }}
          disabled={getIsEmpty()}
        >
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
        disableAutoFocus={true}
        disableEnforceFocus={true}
        slotProps={{
          paper: {
            sx: {
              background: "transparent",
              boxShadow: "none",
            },
          },
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
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                }}
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
        disableAutoFocus={true}
        disableEnforceFocus={true}
        slotProps={{
          paper: {
            sx: {
              background: "transparent",
              boxShadow: "none",
            },
          },
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
              <ListItemText
                primary={integration.name}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </CommandList>
      </Popover>

      <Popover
        open={showScopes}
        anchorEl={anchorEl}
        onClose={() => {
          setShowScopes(false);
          setAnchorEl(null);
          setSelectedCommand(null);
          setSelectedIntegration(null);
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
        disableAutoFocus={true}
        disableEnforceFocus={true}
        slotProps={{
          paper: {
            sx: {
              background: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <CommandList>
          {selectedIntegration?.next?.list.map((scope, index) => (
            <ListItem
              key={scope.id}
              button
              selected={index === selectedOptionIndex}
              onClick={() => handleScopeSelect(scope)}
            >
              <ListItemIcon>
                <Iconify icon={scope.icon} />
              </ListItemIcon>
              <ListItemText
                primary={scope.name}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
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
        slotProps={{
          paper: {
            sx: {
              background: "transparent",
              boxShadow: "none",
            },
          },
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
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                }}
              />
            </ListItem>
          ))}
        </CommandList>
      </Popover>
    </Box>
  );
};

export default InlineChatInput;
