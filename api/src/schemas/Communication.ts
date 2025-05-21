import Joi from "joi";

const Communication = {
  create: Joi.object({
    channelType: Joi.string().valid("WHATSAPP", "SLACK", "EMAIL").required(),
    channelCode: Joi.string().required(),
    responsibilityId: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
  }),
};

export default Communication;
