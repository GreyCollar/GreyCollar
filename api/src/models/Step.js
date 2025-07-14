const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const Step = sequelize.define("Step", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parameters: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  result: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  comment: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "IN_PROGRESS",
    validate: {
      isIn: [["IN_PROGRESS", "SUPERVISED_NEEDED", "COMPLETED", "FAILED"]],
    },
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = Step;
