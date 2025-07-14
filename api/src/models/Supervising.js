const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Supervising = sequelize.define("Supervising", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: "Session",
      key: "id",
    },
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: "Conversation",
      key: "id",
    },
  },
  question: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    reference: {
      model: "conversation",
      key: "content",
    },
  },
  answer: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "IN_PROGRESS",
    validate: {
      isIn: [["IN_PROGRESS", "ANSWERED"]],
    },
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: "Colleague",
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Supervising;
