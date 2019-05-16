import * as Joi from 'joi';

export const sendEmail: Joi.SchemaMap = {
  to: Joi.array()
    .required()
    .items(
      Joi.string()
        .required()
        .email()
        .label('to'),
    )
    .min(1)
    .max(10)
    .unique()
    .label('to email'),
  cc: Joi.array()
    .items(
      Joi.string()
        .required()
        .email()
        .label('cc'),
    )
    .min(0)
    .max(10)
    .unique()
    .label('cc email'),
  bcc: Joi.array()
    .items(
      Joi.string()
        .required()
        .email()
        .label('bcc'),
    )
    .min(0)
    .max(10)
    .unique()
    .label('bcc email'),
  subject: Joi.string()
    .required()
    .max(250),
  body: Joi.string()
    .required()
    .max(5000),
};
