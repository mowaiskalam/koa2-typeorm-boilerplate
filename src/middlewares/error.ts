import * as Joi from 'joi';
import * as Boom from '@hapi/boom';
import * as compose from 'koa-compose';
import { Context } from 'koa';

import { IMetaData } from '../interfaces/response';
import config from '../../config';

const isProduction = config.env === 'production';

const handler = async (ctx: Context, next: () => void) => {
  try {
    await next();
    if (!ctx.state.data) {
      throw Boom.notFound('API not found');
    }
  } catch (err) {
    let metaData: IMetaData;
    if (err.isJoi) {
      metaData = handleJoiError(err);
    } else if (err.isBoom) {
      metaData = handleBoomError(err);
    } else {
      metaData = handleDefaultError(err);
    }
    if (!isProduction) {
      metaData.stack = err.stack;
    }

    ctx.status = +metaData.status;
    ctx.body = {
      meta: metaData,
    };
    // TODO: implement logger
    console.error(err);
  }
};

const handleBoomError = (err: Boom.Boom): IMetaData => {
  return {
    status: +err.output.statusCode,
    message: err.message,
  };
};

const handleJoiError = (err: Joi.ValidationError): IMetaData => {
  return {
    status: 400,
    message: err.details[0].message,
  };
};

const handleDefaultError = (err: any) => {
  return {
    status: +err.status || 500,
    message: err.message || 'Something went wrong!',
  };
};

export default () => compose([handler]);
