import InlineChromiumBugfix from "./InlineChromiumBugFix";
import { css } from "@emotion/css";

const CommandComponent = ({ attributes, children }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      className={css`
        background-color: #2f3136;
        color: white;
        padding: 2px 6px;
        border-radius: 2px;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        font-size: 1.51em;
        height: 22px;
      `}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );
};

export default CommandComponent;
