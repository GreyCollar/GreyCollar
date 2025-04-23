const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Integration = sequelize.define("Integration", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scope: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direction: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["INCOMING", "OUTGOING"]],
    },
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Colleague",
      key: "id",
    },
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    reference: {
      model: "Project",
      key: "id",
    },
  },
  acquired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
});

module.exports = Integration;
