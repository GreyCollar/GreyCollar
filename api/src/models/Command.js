const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Command = sequelize.define("Command", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: ["KNOWLEDGE", "TASK", "SUPERVISING"],
    },
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Project",
      key: "id",
    },
  },
});

module.exports = Command;
