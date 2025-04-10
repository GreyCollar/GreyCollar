const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");

const Responsibility = sequelize.define("Responsibility", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Colleagues",
      key: "id",
    },
  },
});

module.exports = Responsibility;
