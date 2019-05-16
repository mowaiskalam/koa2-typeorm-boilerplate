import { Middleware } from 'koa';
import * as compose from 'koa-compose';
import * as Bunyan from 'bunyan';
import * as KoaBunyan from 'koa-bunyan-logger';
import { mkdirSync, existsSync } from 'fs';
import { join as pathJoin } from 'path';
import * as util from 'util';

let globalLogger: Bunyan;

export class Logger {
  public static koa(logger: Bunyan): Middleware {
    return compose([
      // Attach logger to ctx
      KoaBunyan(logger),

      // Use child logger for request ctx
      KoaBunyan.requestIdContext(),

      // Log requests and responses (with custom messages)
      KoaBunyan.requestLogger({
        // Request GET /apidoc
        formatRequestMessage() {
          return util.format('Request %s %s', this.request.method, this.request.originalUrl);
        },
        // Response (200) GET /apidoc in 30ms
        formatResponseMessage(data: any) {
          return util.format(
            'Response (%d) %s %s in %sms',
            this.status,
            this.request.method,
            this.request.originalUrl,
            data.duration,
          );
        },
      }),
    ]);
  }

  private logDir: string;
  private name: string;
  private serializers: Bunyan.StdSerializers;
  private streams: Bunyan.Stream[];

  constructor(name?: string, dir?: string | null) {
    this.name = name || 'App';
    this.logDir = pathJoin(dir || __dirname + '/../../logs');
    this.serializers = Bunyan.stdSerializers;
    this.streams = [
      {
        level: 'debug',
        stream: process.stdout,
      },
      {
        level: 'debug',
        type: 'rotating-file',
        period: '1d',
        count: 5,
        path: pathJoin(this.logDir, 'debug.json'),
      },
      {
        level: 'error',
        type: 'rotating-file',
        period: '1d',
        count: 5,
        path: pathJoin(this.logDir, 'error.json'),
      },
      {
        level: 'warn',
        type: 'rotating-file',
        period: '1d',
        count: 5,
        path: pathJoin(this.logDir, 'warn.json'),
      },
    ];
  }

  public createLogger(): Bunyan {
    if (globalLogger) {
      return globalLogger;
    }

    this.ensureDirectory();

    globalLogger = new Bunyan({
      name: this.name,
      serializers: this.serializers,
      streams: this.streams,
    });

    return globalLogger;
  }

  private ensureDirectory() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir);
    }
  }
}

export const getLoggerInstance = () => new Logger('koa2-typeorm-boilerplate').createLogger();
