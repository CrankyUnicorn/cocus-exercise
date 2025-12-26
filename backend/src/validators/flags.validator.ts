import Joi from "joi";

export const createFlagSchema = Joi.object({
  key: Joi.string().required(),
  description: Joi.string().required(),
  enabled: Joi.boolean().default(false),
  rolloutPercentage: Joi.number().min(0).max(100).required(),
});

export const updateFlagSchema = Joi.object({
  description: Joi.string().optional(),
  enabled: Joi.boolean().optional(),
  rolloutPercentage: Joi.number().min(0).max(100).optional(),
});
