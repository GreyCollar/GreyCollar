const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes } = platform.require("sequelize");
const Node = require("../schemas/Node");

const Responsibility = sequelize.define("Responsibility", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  pseudo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Colleague",
      key: "id",
    },
  },
  nodes: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidNodes(value) {
        for (const node of value) {
          const validatedNode = Node.default.parse(node);

          if (validatedNode.error) {
            throw new Error(validatedNode.error.message);
          }
        }
      },
    },
  },
});

module.exports = Responsibility;
