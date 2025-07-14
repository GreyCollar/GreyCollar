const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["SYSTEM", "USER", "ASSISTANT"]],
    },
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Colleague",
      key: "id",
    },
  },
  content: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  command: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [["RECEIVED", "READ"]],
    },
  },
  knowledgeId: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Knowledge",
      key: "id",
    },
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: "Project",
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  replyTo: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Message",
      key: "id",
    },
  },
});

module.exports = Message;
