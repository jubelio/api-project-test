import Controllers from './controllers';
import AuthenticationRouteSchema from '@/app/schema/swagger-routes/authentication'

const apiRoutes = async (app:any, options: any) => {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: [options.tags],
      summary: 'Get All Application Data',
      description: 'Get All Application Data',
      headers: AuthenticationRouteSchema.authorizationBearer,
      response: {
        
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.list
  });

  app.route({
    method: 'GET',
    url: '/:applicationID',
    schema: {
      tags: [options.tags],
      summary: 'Get Detail Application Data',
      description: 'Get Detail Application Data',
      headers: AuthenticationRouteSchema.authorizationBearer,
      params: {
        required: ['applicationID'],
        type: 'object',
        properties: {
            applicationID: { type: 'number', example: '1' }
        }
      },
      response: {
        
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.detail
  });

  app.route({
    method: 'POST',
    url: '/',
    schema: {
      consumes: ['multipart/form-data'],
      tags: [options.tags],
      summary: 'Insert New Application Data',
      description: 'Insert New Application Data',
      headers: AuthenticationRouteSchema.authorizationBearer,
      body: {
        required: ['name','url'],
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 5, example: 'Application Name' },
            description: { type: 'string', minLength: 5, example: 'Application Description' },
            url: { type: 'string', example: 'https://website.com' },
            logo: { isFileType: true }
        }
      },
      response: {
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.create
  });

  app.route({
    method: 'PATCH',
    url: '/:applicationID',
    schema: {
      tags: [options.tags],
      summary: 'Update Application Data',
      description: 'Update Application Data',
      headers: AuthenticationRouteSchema.authorizationBearer,
      params: {
        required: ['applicationID'],
        type: 'object',
        properties: {
            applicationID: { type: 'number', example: '1' }
        }
      },
      body: {
        required: ['name','url'],
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 5, example: 'Application Name' },
            description: { type: 'string', example: 'Application Description' },
            url: { type: 'string', minLength: 5, example: 'https://website.com' },
            isActive: { type: 'boolean', example: true }
        }
      },
      response: {
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.update
  });

  app.route({
    method: 'PATCH',
    url: '/:applicationID/logo',
    schema: {
      consumes: ['multipart/form-data'],
      tags: [options.tags],
      summary: 'Update Application Logo',
      description: 'Update Application Logo',
      headers: AuthenticationRouteSchema.authorizationBearer,
      params: {
        required: ['applicationID'],
        type: 'object',
        properties: {
            applicationID: { type: 'number', example: '1' }
        }
      },
      body: {
        required: ['logo'],
        type: 'object',
        properties: {
            logo: { isFileType: true }
        }
      },
      response: {
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.updateLogo
  });

  app.route({
    method: 'DELETE',
    url: '/:applicationID',
    schema: {
      tags: [options.tags],
      summary: 'Delete Application Data',
      description: 'Delete Application Data',
      headers: AuthenticationRouteSchema.authorizationBearer,
      params: {
        required: ['applicationID'],
        type: 'object',
        properties: {
            applicationID: { type: 'number', example: '1' }
        }
      },
      response: {
        
      }
    },
    preHandler: app['authenticate-jwt-default'],
    handler: Controllers.remove
  });

}


export default apiRoutes;
