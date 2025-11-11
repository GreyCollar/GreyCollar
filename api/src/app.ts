import "express";

import * as platform from "@canmingir/link-express";

import agent from "./functions/agent";
import colleagues from "./routes/colleagues";
import communications from "./routes/communications";
import config from "../config";
import engines from "./routes/engines";
import { event } from "node-event-test-package/client";
import integrations from "./routes/integrations";
import knowledge from "./routes/knowledge";
import messages from "./routes/messages";
import organizations from "./routes/organizations";
import projects from "./routes/projects";
import responsibilities from "./routes/responsibilities";
import sessions from "./routes/sessions";
import statistics from "./routes/statistics";
import supervisings from "./routes/supervisings";
import tasks from "./routes/tasks";
import teamDetails from "./routes/teamDetails";
import { telemetryMiddleware } from "./instrumentation";

declare module "express-serve-static-core" {
  interface Request {
    session: {
      userId: string;
      appId: string;
      organizationId: string;
      projectId: string;
    };
  }
}

const { authorization } = platform;

const app = platform.express();

if (config.metrics.enabled) {
  app.use(telemetryMiddleware());
}

app.use(authorization.verify);
app.use(authorization.authorize("ADMIN"));

app.use("/projects", projects);
app.use("/teams/details", teamDetails);
app.use("/colleagues", colleagues);
app.use("/knowledge", knowledge);
app.use("/messages", messages);
app.use("/sessions", sessions);
app.use("/supervisings", supervisings);
app.use("/tasks", tasks);
app.use("/engines", engines);
app.use("/organizations", organizations);
app.use("/statistics", statistics);
app.use("/responsibilities", responsibilities);
app.use("/integrations", integrations);
app.use("/communications", communications);

(async () => {
  await event.subscribe<{ teamId: string; content: string }>(
    "MESSAGE_USER_MESSAGED",
    ({ teamId, content }) => agent.teamChat({ teamId, content })
  );

  await event.subscribe<{
    colleagueId: string;
    sessionId: string;
    content: string;
  }>("SESSION_USER_MESSAGED", ({ colleagueId, sessionId, content }) =>
    agent.chat({
      colleagueId,
      sessionId,
      content,
    })
  );

  await event.subscribe<{
    sessionId: string;
    colleagueId: string;
    question: string;
  }>("SUPERVISING_ANSWERED", ({ sessionId, colleagueId, question }) =>
    agent.chat({
      colleagueId,
      sessionId,
      content: question,
    })
  );

  await event.subscribe<{ taskId: string }>("TASK_CREATED", ({ taskId }) =>
    agent.task({ taskId })
  );

  await event.subscribe<{
    stepId: string;
    action: string;
    parameters: object;
    comment: string;
  }>("STEP_ADDED", ({ stepId, action, parameters, comment }) =>
    agent.step({ stepId, action, parameters, comment })
  );

  await event.subscribe<{ taskId: string }>("STEP_COMPLETED", ({ taskId }) =>
    agent.task({ taskId })
  );
})();

export default app;
