import { exec } from 'child_process';
import rp from 'request-promise';
import chai from 'chai';
import chaiHttp from 'chai-http';
import XConfig from '@config/_core';


chai.use(chaiHttp);
chai.should();





module.exports = {
    context: {  
        request: chai.request(XConfig.get('/application/baseUrl'))
    },

    migrateDB: function() {
        console.log('Migrating database...');
        exec('npm run sequelize:seed:undo:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
        setTimeout(function () {
            exec('npm run sequelize:migrate:undo:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
            setTimeout(function () {
                exec('npm run sequelize:migrate --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
                setTimeout(function () {
                    console.log('Seeding database...');
                    exec('npm run sequelize:seed:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
                 }, 5000)  
             }, 2000)  
         }, 2000)  
        
        
        
        
    },

    cleanDB: function() {
        console.log('Clean up database...');
        exec('npm run sequelize:seed:undo:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
        setTimeout(function () {
            exec('npm run sequelize:migrate:undo:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test');
         }, 5000)  
        // await new Promise((resolve, reject) => {
        //     const migrate = exec(
        //       'npm run sequelize:seed:undo:all --X_DBNAME=postgres --X_INSTANCE=default --X_ENV=test',
        //       err => (err ? reject(err): resolve('OK'))
        //     );
          
        //     migrate.stdout.pipe(process.stdout);
        //     migrate.stderr.pipe(process.stderr);
        // });
    },

    sendRequest: async function(method, url, body) {
        var options:any = {};
        options.method = method;
        options.url = url;

        if (body) {
            options.body = body;
        }
        options.headers = { 'content-type': 'application/json' };
        options.json = true;

        try {
            return await rp(options);
        } catch (err) {
            console.log('Error while sending a request', err);
        }
    }
};
