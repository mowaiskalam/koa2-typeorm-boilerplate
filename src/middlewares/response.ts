import * as compose from 'koa-compose';
import { Context } from 'koa';

import { IResponse } from '../interfaces/response';

const handler = async (ctx: Context, next: () => void) => {
  ctx.body = {} as IResponse;
  ctx.body = {
    meta: {
      status: ctx.status,
      message: ctx.state.message,
    },
    data: ctx.state.data,
  };
  await next();
};

export default () => compose([handler]);
