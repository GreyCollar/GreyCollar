const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");

const Responsibilities = sequelize.define("Responsibilities", {
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
});

module.exports = Responsibilities;
