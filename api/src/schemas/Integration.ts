import Joi from "joi";

const Integration = {
  create: Joi.object({
    provider: Joi.string(),
    description: Joi.string(),
    colleagueId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .optional(),
    teamId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .optional(),
  }),
};

export default Integration;
