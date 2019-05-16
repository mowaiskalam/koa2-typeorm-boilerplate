import * as Joi from 'joi';

const messages: Joi.LanguageMessages = {
  key: '{{label}} ',
};
const defaultOptions: Joi.ValidationOptions = {
  messages,
  allowUnknown: false,
  // convert: false,
};

export const validate = <T>(payload: T, schema: Joi.Schema, options?: Joi.ValidationOptions): any => {
  const joiValidationOptions = options
    ? Object.assign({}, defaultOptions, options)
    : defaultOptions;
  const { error, value } = schema.validate(payload, joiValidationOptions);
  if (error) {
    throw error;
  }
  return value;
};
