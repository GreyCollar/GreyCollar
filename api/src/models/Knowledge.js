const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Knowledge = sequelize.define("Knowledge", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["URL", "TEXT", "QA", "TASK"]],
    },
  },
  question: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Task",
      key: "id",
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "COMPLETED",
    validate: {
      isIn: [["IN_PROGRESS", "COMPLETED"]],
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Knowledge;
