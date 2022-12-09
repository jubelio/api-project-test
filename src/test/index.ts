import 'module-alias/register'; 
import { exec } from 'child_process';
import * as Server from '@/server';
import * as Utils from '@/utils'; 
import XConfig from '@config/_core'
import fileManipulator from '@/lib/files/file-manipulator';

const TestUtils = require('@test/utils');

const buildServer = () => {
    Server.build().then(app => {
    app.listen(XConfig.get('/application/port'), '0.0.0.0')
        .then(_ => {
        const exitHandler = Utils.terminate(app, {
            coredump: false,
            timeout: 500
        })

        console.log(`Server started. ENV=${process.env.NODE_ENV}, PORT=${XConfig.get('/application/port')}`);
        console.log();
        startTesting()

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
}

const startTesting = () => {
    console.log("=================================> BEGIN <==================================");
    console.log(`APP Name: ${XConfig.get('/application/info/title')}`);
    console.log(`APP Version: ${XConfig.get('/application/info/version')}`);

        before((done) => {
            console.log('--------------------------- START: Prepare Server -------------------------- ');
            console.log('Open server connection...');
             setTimeout(function () {
                TestUtils.migrateDB();
                setTimeout(function () {
                    console.log('--------------------------- FINISH: Prepare Server ------------------------- ');
                    console.log();
                    console.log('------------------------------- START: Test -------------------------------- ');
                    done();
                 }, 16000)
             }, 2000)
        });

        
    
        after((done) => {
            console.log('------------------------------- FINISH: Test -------------------------------- ');
            console.log();
            console.log('--------------------------- START: Clean Up Server -------------------------- ');
            TestUtils.cleanDB();
            setTimeout(function () {
                const statifFile = XConfig.get('/application/staticFile');
                const dir = fileManipulator.getDirPath({
                    definition: statifFile.definition.default,
                    manifest: 'root'
                });
                exec(`rm -rf ${statifFile.root}${dir}`);
                console.log('Close server connection...');
                console.log('--------------------------- FINISH: Clean Up Server ------------------------- ');
                console.log();
                console.log('==================================> END <==================================== ');
                done();
             }, 5000)
        }); 
    

        //API V1
        describe('API v1',  () => {
            require('./testcases/v1/_base');
        })
}

buildServer();