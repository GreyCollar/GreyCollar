const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");

const ResponsibilityNode = sequelize.define("ResponsibilityNode", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  properties: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  next: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  responsibilityId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Responsibility",
      key: "id",
    },
  },
});

module.exports = ResponsibilityNode;
