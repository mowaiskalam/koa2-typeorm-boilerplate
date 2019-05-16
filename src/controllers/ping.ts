import { Context } from 'koa';

export const ping = async (ctx: Context, next: () => void) => {
  ctx.state.data = `pong!`;
  await next();
};
