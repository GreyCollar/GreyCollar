import "../styles/chat.css";

import { Helmet } from "react-helmet-async";
import React from "react";
import { TeamChatWidget } from "../widgets/TeamChatWidget";
import config from "../../config";
import { storage } from "@nucleoidjs/webstorage";

function Chat() {
  const projectId = storage.get("projectId");
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {config.name} - Chat </title>
      </Helmet>

      <TeamChatWidget projectId={projectId} />
    </>
  );
}

export default Chat;
