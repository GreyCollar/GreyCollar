/* eslint disable*/
async function init() {
  const { Project } = require("@nucleoidai/platform-express/models");

  const Task = require("./Task");
  const Command = require("./Command");
  const Colleague = require("./Colleague");
  const ColleagueKnowledge = require("./ColleagueKnowledge");
  const TeamDetails = require("./TeamDetails");
  const Message = require("./Message");
  const Session = require("./Session");
  const Conversation = require("./Conversation");
  const Supervising = require("./Supervising");
  const Knowledge = require("./Knowledge");
  const AIEngine = require("./AIEngine");
  const Step = require("./Step");
  const Statistics = require("./Statistics");
  const Responsibility = require("./Responsibility");
  const ResponsibilityNode = require("./ResponsibilityNode");
  const Integration = require("./Integration");
  const Communication = require("./Communication");

  Responsibility.hasMany(Communication, {
    foreignKey: "responsibilityId",
  });
  Communication.belongsTo(Responsibility, {
    foreignKey: "responsibilityId",
  });

  Project.hasMany(Colleague, {
    foreignKey: "teamId",
  });

  Colleague.belongsTo(Project, {
    foreignKey: "teamId",
  });

  Colleague.hasMany(Responsibility, { foreignKey: "colleagueId" });
  Responsibility.belongsTo(Colleague, { foreignKey: "colleagueId" });

  Integration.belongsToMany(Project, {
    through: "Integration",
    foreignKey: "id",
  });

  Project.belongsToMany(Integration, {
    through: "Integration",
    foreignKey: "teamId",
  });

  Integration.belongsTo(Colleague, { foreignKey: "colleagueId" });

  Statistics.belongsTo(Project, { foreignKey: "teamId" });

  Project.hasMany(Colleague, { foreignKey: "teamId", as: "colleagues" });
  Colleague.belongsTo(Project, { foreignKey: "teamId", as: "colleagues" });

  Project.hasMany(Command, { foreignKey: "teamId" });
  Command.belongsTo(Project, { foreignKey: "teamId" });

  Project.belongsToMany(ColleagueKnowledge, { through: "ColleagueKnowledge" });
  ColleagueKnowledge.belongsToMany(Project, { through: "ColleagueKnowledge" });

  Session.hasMany(Conversation, { foreignKey: "sessionId" });
  Conversation.belongsTo(Session, { foreignKey: "sessionId" });

  Session.belongsToMany(Supervising, {
    through: "SessionSupervising",
    foreignKey: "sessionId",
  });

  Supervising.belongsTo(Conversation, { foreignKey: "conversationId" });

  Supervising.belongsTo(Colleague, { foreignKey: "colleagueId" });

  Colleague.hasMany(Supervising, { foreignKey: "colleagueId" });

  Task.belongsTo(Colleague, { foreignKey: "colleagueId", onDelete: "CASCADE" });

  Colleague.hasMany(Task, { foreignKey: "colleagueId", onDelete: "CASCADE" });

  Project.hasMany(Colleague, { foreignKey: "teamId" });
  Colleague.belongsTo(Project, { foreignKey: "teamId" });

  Colleague.belongsToMany(ColleagueKnowledge, {
    through: "ColleagueKnowledge",
  });

  ColleagueKnowledge.belongsTo(Colleague, { foreignKey: "colleagueId" });
  Colleague.hasMany(ColleagueKnowledge, { foreignKey: "colleagueId" });

  Knowledge.hasOne(ColleagueKnowledge, { foreignKey: "knowledgeId" });
  ColleagueKnowledge.belongsTo(Knowledge, { foreignKey: "knowledgeId" });

  Knowledge.belongsTo(Task, { foreignKey: "taskId" });
  Task.hasOne(Knowledge, { foreignKey: "taskId" });

  AIEngine.hasMany(Colleague, { foreignKey: "aiEngineId" });
  Colleague.belongsTo(AIEngine, { foreignKey: "aiEngineId" });

  Task.hasMany(Step, { foreignKey: "taskId", as: "steps" });
  Step.belongsTo(Task, { foreignKey: "taskId", as: "task" });

  Project.hasOne(TeamDetails, { foreignKey: "id" });
  TeamDetails.belongsTo(Project, { foreignKey: "id" });

  Project.addHook("beforeDestroy", async (project) => {
    await Colleague.destroy({
      where: {
        teamId: project.id,
      },
    });
    await ColleagueKnowledge.destroy({
      where: {
        teamId: project.id,
      },
    });
    await TeamDetails.destroy({
      where: {
        teamId: project.id,
      },
    });
  });

  Colleague.addHook("beforeDestroy", async (colleague) => {
    await Supervising.destroy({
      where: {
        colleagueId: colleague.id,
      },
    });
    await ColleagueKnowledge.destroy({
      where: {
        colleagueId: colleague.id,
      },
    });
  });

  Message.addHook("beforeCreate", async (message) => {
    if (message.role === "USER") {
      message.status = "READ";
    } else if (message.role === "ASSISTANT") {
      message.status = null;
    }
  });

  Responsibility.hasMany(ResponsibilityNode, {
    foreignKey: "responsibilityId",
    as: "Nodes",
  });
  ResponsibilityNode.belongsTo(Responsibility, {
    foreignKey: "responsibilityId",
  });

  ResponsibilityNode.belongsTo(Node, {
    foreignKey: "dependencyId",
    as: "Dependency",
  });
  ResponsibilityNode.hasMany(Node, {
    foreignKey: "dependencyId",
    as: "Dependents",
  });
}

export default { init };
/* eslint disable*/
