// const apm = require('elastic-apm-node').start({
//   // serviceName: '',
//   serverUrl: process.env.ELK_STACK_APM_SERVER_URL,
//   verifyServerCert: false,
//   serverCaCertFile: '/usr/src/app/certificate/'+process.env.ELK_STACK_CA_CERT_PATH,
//   secretToken: process.env.ELK_STACK_ELASTIC_TOKEN,
//   // apiKey: '',
//   // active: process.env.NODE_ENV === 'production'
// });

import 'module-alias/register';
import * as Server from '@/server';
import * as Utils from '@/utils';
import XConfig from '@config/_core'

Server.build()
  .then(app => {
    app.listen(XConfig.get('/application/port'), '0.0.0.0')
      .then(_ => {
        app.swagger()
        const exitHandler = Utils.terminate(app, {
          coredump: false,
          timeout: 500
        })

        process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
        process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
        process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
        process.on('SIGINT', exitHandler(0, 'SIGINT'))
      })
      .catch(err => {
        console.log('Error starting server: ', err)
        process.exit(1)
      })
  })
  .catch(err => console.log(err))
