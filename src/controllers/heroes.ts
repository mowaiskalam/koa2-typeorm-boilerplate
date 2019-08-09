import * as service from '../services/heroes';
import { Context } from 'koa';
import { IHeroRequest } from '../interfaces/hero';

export const getAll = async (ctx: Context, next: () => void) => {
    ctx.state.data = await service.getAll();
    await next();
};

export const save = async (ctx: Context, next: () => void) => {
    const payload: IHeroRequest = ctx.request.body;
    const id: number = ctx.params.id;
    ctx.state.data = await service.addHero(payload, id);
    await next();
};

export const deleteHero = async (ctx: Context, next: () => void) => {
    const id: number = ctx.params.id;
    ctx.state.data = await service.deleteHero(id);
    await next();
};