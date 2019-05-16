import { getLoggerInstance } from '../utils/logger';
const logger = getLoggerInstance();
import config from '../../config/index';
import { bootstrapDatabase, clearDatabaseCache } from './typeorm';

export const bootstrap = async (): Promise<boolean> => {
  try {
    await bootstrapDatabase();
    logger.info(`postgres connected host: ${config.database.host} , port: ${config.database.port}`);

    if (config.env !== 'local') {
      logger.info('Clearing cache');
      await clearDatabaseCache();
    }
  } catch (err) {
    logger.error('Error while connecting database', err);
    throw err;
  }
  return Promise.resolve(true);
};
