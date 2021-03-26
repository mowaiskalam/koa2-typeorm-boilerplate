import { Heroes } from './../entities/heroes';
import { getRepository } from 'typeorm';

export const getAll = async () => {
  return getRepository(Heroes).find({
    where: {
      isActive: true,
    },
  });
};

export const save = async (hero: Heroes) => {
  return getRepository(Heroes).save(hero);
  // return getRepository(Heroes).insert(hero);
};
