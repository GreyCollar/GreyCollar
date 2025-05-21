const platform = require("@nucleoidai/platform-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Communication = sequelize.define("Communication", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  channelType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["WHATSAPP", "SLACK", "EMAIL"]],
    },
  },
  channelCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsibilityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Responsibility",
      key: "id",
    },
  },
});

module.exports = Communication;
