const platform = require("@canmingir/link-express");
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
  mcpId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  refreshToken: {
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
});

module.exports = Integration;
