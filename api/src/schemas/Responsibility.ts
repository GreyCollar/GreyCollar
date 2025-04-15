import Joi from "joi";

const Responsibility = {
  upsert: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    colleagueId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
    nodes: Joi.array().items(
      Joi.object({
        id: Joi.string()
          .guid({ version: ["uuidv4"] })
          .required(),
        properties: Joi.object({
          label: Joi.string().required(),
          icon: Joi.string().required(),
        }).optional(),
        dependencyId: Joi.string()
          .guid({ version: ["uuidv4"] })
          .optional(),
        responsibilityId: Joi.string()
          .guid({ version: ["uuidv4"] })
          .optional(),
      })
    ),
  }),
};

export default Responsibility;
