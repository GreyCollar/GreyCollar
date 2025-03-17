import Knowledge from "../widgets/Knowledge/Knowledge";
import Page from "../components/Page/Page";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";

function KnowledgeBase() {
  const teamId = storage.get("projectId");

  return (
    <>
      <Page name={"Knowledge"} />
      <Knowledge teamId={teamId} />
    </>
  );
}
export default KnowledgeBase;
