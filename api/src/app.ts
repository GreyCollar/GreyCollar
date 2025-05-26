import "express";

import * as platform from "@nucleoidai/platform-express";

import agent from "./functions/agent";
import colleagues from "./routes/colleagues";
import communications from "./routes/communications";
import engines from "./routes/engines";
import integrations from "./routes/integrations";
import knowledge from "./routes/knowledge";
import messages from "./routes/messages";
import metrics from "./routes/metrics";
import organizations from "./routes/organizations";
import projects from "./routes/projects";
import responsibilities from "./routes/responsibilities";
import sessions from "./routes/sessions";
import statistics from "./routes/statistics";
import { subscribe } from "./lib/Event";
import supervisings from "./routes/supervisings";
import tasks from "./routes/tasks";
import teamDetails from "./routes/teamDetails";

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

app.use("/metrics", metrics);

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
subscribe("MESSAGE", "USER_MESSAGED", ({ teamId, content }) =>
  agent.teamChat({ teamId, content })
);
subscribe(
  "SESSION",
  "USER_MESSAGED",
  ({ colleagueId, sessionId, conversationId, content }) =>
    agent.chat({
      colleagueId,
      sessionId,
      conversationId,
      content,
    })
);
subscribe(
  "SUPERVISING",
  "ANSWERED",
  ({ sessionId, conversationId, colleagueId, question }) =>
    agent.chat({
      colleagueId,
      sessionId,
      conversationId,
      content: question,
    })
);
subscribe("TASK", "CREATED", ({ taskId }) => agent.task({ taskId }));
subscribe("STEP", "ADDED", ({ stepId, action, parameters }) =>
  agent.step({ stepId, action, parameters })
);
subscribe("STEP", "COMPLETED", ({ taskId }) => agent.task({ taskId }));

export default app;
