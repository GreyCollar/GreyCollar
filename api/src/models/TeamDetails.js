const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");

const TeamDetails = sequelize.define("TeamDetails", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    reference: {
      model: "Project",
      key: "id",
    },
  },
  coach: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coachAvatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = TeamDetails;
