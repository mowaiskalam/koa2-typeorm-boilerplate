import { Context } from 'koa';
import * as service from '../services/heroes';
import { IHeroRequest } from '../interfaces/hero';

export const getAll = async (ctx: Context, next: () => void) => {
  ctx.state.data = await service.getAll();
  await next();
};

export const save = async (ctx: Context, next: () => void) => {
  const id: string = ctx.params.id;
  const payload: IHeroRequest = ctx.request.body;
  ctx.state.data = await service.addHero(payload);
  await next();
};
