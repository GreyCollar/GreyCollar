const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Statistics = sequelize.define("Statistics", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  responseRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supervisingRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  knowledgeSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  taskCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalMessages: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Project",
      key: "id",
    },
  },
});

module.exports = Statistics;
