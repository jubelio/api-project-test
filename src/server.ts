import fastify from 'fastify';
import os from 'os';
import pino from 'pino';
import { fromEnv } from '@/utils';
import regex from '@helpers/string/regex';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '@rpc/error';


//IMPORT MODULES
import FsCors from 'fastify-cors';
import FsHelmet from 'fastify-helmet';
import FsSwagger from 'fastify-swagger';
import FsStatic from 'fastify-static';
import XConfig from '@config/_core';
import XModAuthJWTVerify from '@authentication/jwt/jwtAuthVerify';
import XModDBPostgres from '@/lib/connection/database/postgres';

// LOG
const logsConfig = {
  formatters: {
    level (level) {
      return { level }
    }
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  level: fromEnv('LOG_LEVEL')
}

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'time,pid,hostname'
    },
    level: fromEnv('LOG_LEVEL')
  },
  staging: logsConfig,
  production: logsConfig
}


// Schema Compiler
const Ajv = require('ajv');
const ajv = new Ajv({
  $data: true,
  strict: true,
  allErrors: true,
  useDefaults: true,
  coerceTypes: true,
  validateFormats: true,
  unicodeRegExp: true,
  formats: {
    'uri': regex.uri
  }
});

ajv.addKeyword({
  keyword: "isFileType",
  compile: (schema, parent, it) => {
    parent.type = 'file'
    delete parent.isFileType
    return () => true
  }
}).addKeyword({keyword: 'example'});

// Build Server
const build = async () => {
  // Fastify Server
  let server;
  if(fromEnv('NODE_ENV')!='test'){
    server = fastify({
      bodyLimit: 1048576 * 2,
      logger: pino(logger[fromEnv('NODE_ENV')]),
      http2: true,
      https: XConfig.get('/application/tlsOptions'),
      schemaController: {
        compilersFactory: {
          buildValidator: ajv
        }
      }
    });
  }else{
    server = fastify({
      bodyLimit: 1048576 * 2,
      logger: null,
      schemaController: {
        compilersFactory: {
          buildValidator: ajv
        }
      }
    });
  }

  console.table(os.cpus());

  // Register Modules
  await server
  //CORS
  .register(FsCors, {
    origin: '*',
    methods: ['GET','POST','PATCH','UPDATE']
  })
  //Helmet
  .register(FsHelmet, {
    contentSecurityPolicy: {
      directives: {
        baseUri: ['\'self\''],
        defaultSrc: ['\'self\''],
        scriptSrc: ['\'self\''],
        objectSrc: ['\'self\''],
        workerSrc: ['\'self\'', 'blob:'],
        frameSrc: ['\'self\''],
        formAction: ['\'self\''],
        upgradeInsecureRequests: []
      }
    }
  })
  // FILE-UPLOAD
  .register(FsStatic, {
    root: `${XConfig.get('/application/staticFile/root')}/${XConfig.get('/application/staticFile/definition/default/directory')}`,
    prefix: `/${XConfig.get('/application/staticFile/definition/default/prefix')}/`
  })
  .register(require('fastify-multipart'),
  {
    // attachFieldsToBody: true
    addToBody: true
  })
  // AUTHENTICATION
  .register(XModAuthJWTVerify, {
    name: 'authenticate-jwt-default',
    config: XConfig.get('/jwtAuthOptions/default'),
    validationMethod: 'none'
  })
  // DATABASE
  .register(XModDBPostgres,
  [
    {
      credential: XConfig.get('/databases/postgres/default'),
      info: {
        id: "DEFAULT",
        env: XConfig.get('/application/environment')
      }
    }
  ])
  // DOCUMENTATION
  .register(FsSwagger, XConfig.get('/swagger'))
  .setValidatorCompiler(({ schema, method, url, httpPart }) =>
    ajv.compile(schema)
  );

  //ROUTES
  await server
  .register(require('@api/v1/_core/routes'), { prefix: 'api/v1' })
  .setNotFoundHandler((request, reply) => {
    server.log.debug(`Route not found: ${request.method}:${request.raw.url}`)

    reply.status(404).send({
      statusCode: 404,
      error: NOT_FOUND,
      message: `Route ${request.method}:${request.raw.url} not found`
    })
  })
  .setErrorHandler((err, request, reply) => {
    server.log.debug(`Request url: ${request.raw.url}`)
    server.log.debug(`Payload: ${request.body}`)
    server.log.error(`Error occurred: ${err}`)

    const code = err.statusCode ?? 400

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? "Bad Request",
      message: err.message ?? err
    })
  });

  return server
}

// implement inversion of control to make the code testable
export {
  build
}
