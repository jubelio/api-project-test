import 'module-alias/register';
import fs from 'fs';
import XConfig from '@config/_core';

const instance = 'default';
const environments=XConfig.get('/application/environments');
var credentials:any={};
environments.forEach(environment => {
    let cred:any={};
    const storagePath = `src/lib/connection/database/postgres/${instance}/_storage/${environment}`

    if (!fs.existsSync(storagePath)){
        fs.mkdirSync(storagePath, { recursive: true });
    }

    cred=XConfig.get(`/databases/postgres/${instance}`, {env: environment});
    cred.dialect='postgres';
    cred.migrationStorage='json';
    cred.migrationStoragePath=`${storagePath}/_meta.json`;
    cred.seederStorage='json';
    cred.seederStoragePath=`${storagePath}/_data.json`;
    credentials[environment]=cred;
});

module.exports = credentials;
