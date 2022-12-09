import Controllers from './controllers/multithreading';

const apiRoutes = async (app, options) => {
  app.route({
    method: 'GET',
    url: '/no-multithreading-sync',
    schema: {
      tags: [options.tags],
      summary: 'Test Multithreading (SYNC)',
      description: 'Test without multithreading',
    },
    handler: Controllers.noMultithreadingSync
  });

  app.route({
    method: 'GET',
    url: '/multithreading-sync',
    schema: {
      tags: [options.tags],
      summary: 'Test Multithreading (SYNC)',
      description: 'Test multithreading with Piscina',
    },
    handler: Controllers.multithreadingPiscinaSync
  });

  app.route({
    method: 'GET',
    url: '/no-multithreading-async',
    schema: {
      tags: [options.tags],
      summary: 'Test Multithreading (ASYNC)',
      description: 'Test without multithreading',
    },
    handler: Controllers.noMultithreadingAsync
  });

  app.route({
    method: 'GET',
    url: '/multithreading-async',
    schema: {
      tags: [options.tags],
      summary: 'Test Multithreading (ASYNC)',
      description: 'Test multithreading with Piscina',
    },
    handler: Controllers.multithreadingPiscinaAsync
  });
}




export default apiRoutes;
