import Joi from "joi";

const ResponsibilityNode = {
  create: Joi.array().items(
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
        .required(),
    })
  ),
};

export default ResponsibilityNode;
