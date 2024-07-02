import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import { proxy, createServer } from 'aws-serverless-express';
import { Server } from 'http';
import express = require('express');
import * as helmet from 'helmet';

import { ExpressAdapter } from '@nestjs/platform-express';
import { eventContext } from 'aws-serverless-express/middleware';

import debug from 'debug';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

const verbose = debug('api:verbose: handler');
let cachedServer: Server;


async function bootstrapServer(context: Context) {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        cors: true,
        logger:
          process.env.NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    );
    app.setGlobalPrefix('/api/v1');
    //app.use(eventContext())
    app.use(helmet.noSniff());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.contentSecurityPolicy());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    cachedServer = createServer(expressApp, undefined);
  }
  return cachedServer;
}
// lambda fn
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  verbose(`event: %j`, event);
  verbose(`context: %j`, context);
  cachedServer = await bootstrapServer(context);
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};