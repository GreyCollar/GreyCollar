import Joi from "joi";

const Responsibility = {
  create: Joi.object({
    id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    colleagueId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
  }),
};

export default Responsibility;
