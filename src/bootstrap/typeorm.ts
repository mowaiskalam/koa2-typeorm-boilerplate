import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions,
  Logger,
  getConnection,
} from 'typeorm';
import config from '../../config';
import { getLoggerInstance } from '../utils/logger';
const logger = getLoggerInstance();

class DatabaseLogger implements Logger {
  public logQuery = (query: string, parameters?: any[]): any => {
    logger.info(query, parameters);
  };

  public logQueryError = (error: string, query: string, parameters?: any[]): any => {
    logger.error(error, query, parameters);
  };

  public logQuerySlow = (time: number, query: string, parameters?: any[]): any => {
    logger.warn(time, query, parameters);
  };

  public logMigration = (message: string): any => {
    logger.info(message);
  };

  public logSchemaBuild = (message: string): any => {
    logger.info(message);
  };

  public log = (level: 'log' | 'info' | 'warn' | 'error', message: any): any => {
    logger.info(level, message);
  };
}

export const bootstrapDatabase = async (): Promise<any> => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    logging: ['error'],
    logger: new DatabaseLogger(),
    synchronize: false,
    maxQueryExecutionTime: config.database.maxQueryExecutionTime,
  });
  return createConnection(connectionOptions);
};

export const clearDatabaseCache = async (): Promise<any> => {
  const connection = getConnection();
  return connection.queryResultCache!.clear();
};
