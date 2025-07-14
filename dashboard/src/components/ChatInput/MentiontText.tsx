import InlineChromiumBugfix from "./InlineChromiumBugFix";
import { css } from "@emotion/css";

import { alpha, useTheme } from "@mui/material";

const MentionText = (props) => {
  const { attributes, element } = props;

  const theme = useTheme();
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
        height: 22px;
      `}
    >
      <InlineChromiumBugfix />
      {element.children[0].text}
      <InlineChromiumBugfix />
    </span>
  );
};

export default MentionText;
