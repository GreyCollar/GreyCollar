import Joi from "joi";

const Integration = {
  create: Joi.object({
    provider: Joi.string().required(),
    description: Joi.string().required(),
    scope: Joi.string().required(),
    direction: Joi.string().required(),
    colleagueId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .optional(),
    teamId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .optional(),
  }),
};

export default Integration;
