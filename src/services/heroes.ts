import * as joi from 'joi';
import * as repo from '../repositories/heroes';
import { Heroes } from './../entities/heroes';
import { IHeroRequest } from '../interfaces/hero';

export const getAll = async () => {
  return repo.getAll();
};

export const addHero = async (hero: IHeroRequest) => {
  const scheme = joi.object({
    name: joi.string().required(),
  });
  await scheme.validateAsync({ name: hero.name });
  const toSaveHero = new Heroes();
  toSaveHero.name = hero.name;
  return repo.save(toSaveHero);
};
