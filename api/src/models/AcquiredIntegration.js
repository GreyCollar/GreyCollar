const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const AcquiredIntegration = sequelize.define("AcquiredIntegration", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  integrationId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: "Integration",
      key: "id",
    },
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = AcquiredIntegration;
