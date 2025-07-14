const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");

const Session = sequelize.define("Session", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["CHAT", "EMAIL"]],
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
});

module.exports = Session;
