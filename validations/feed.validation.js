import Joi from "joi";

export const feedSchemaValidation = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().required(),

  user: Joi.string().required(),

  skills: Joi.array().items(Joi.string()).required(),

  category: Joi.string()
    .valid("Development", "Design", "Marketing", "Database", "DevOps")
    .required(),

  urgency: Joi.string().valid("High", "Medium", "Low").required(),

  location: Joi.string().required(),

});
