const platform = require("@canmingir/link-express");
const {
  Postgres: { sequelize },
} = platform.module();
const { DataTypes, UUIDV4 } = platform.require("sequelize");

const ColleagueKnowledge = sequelize.define("ColleagueKnowledge", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  knowledgeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  colleagueId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = ColleagueKnowledge;
