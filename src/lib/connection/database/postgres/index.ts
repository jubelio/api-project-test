'use strict';
const Sequelize = require('sequelize');
import FastifyPlugin from 'fastify-plugin';


var connection={};
function plugin(fastify, opts, done) {
  opts.forEach(options=> {
    const credential=options.credential;
    const node = `[${options.info.id} - ${options.info.env}]`;

    const node_connection = new Sequelize(`postgres://${encodeURIComponent(credential.username)}:${encodeURIComponent(credential.password)}@${credential.host}:${credential.port}/${encodeURIComponent(credential.database)}`, 
    {
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    connection[options.info.id]=node_connection;
    try {
      node_connection.authenticate().then(() => {
        console.log(` [*] Connection to the POSTGRESQL:${node} database has been established successfully.`);
       })
       .catch(err => {
        console.log(` [*] ERROR - Unable to connect to the POSTGRESQL:${node} database:`, err)
      });
    } catch (error) {
      console.log(` [*] Unable to connect to the POSTGRESQL:${node} database:`, error);
    }
  });
  done();
}

export default FastifyPlugin(plugin, {
  name: 'postgres',
});

export const Prop:any = {
  connection,
  Sequelize
}
