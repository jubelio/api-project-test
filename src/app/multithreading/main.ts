import os from 'os';
import Piscina from 'piscina';
import path from 'path';


const PocSync = async (variable: string) => {
    const piscina = new Piscina({
        filename: path.resolve(`${__dirname}/workers/poc/pooled-sync-sleep`),
        minThreads: 2,
        maxThreads: os.cpus().length*2,
        concurrentTasksPerWorker: 10
    });

    const result = await piscina.run("Piscina");

    return `${variable} ${result}`;
};

const PocAsync = async (variable: string) => {
    const piscina = new Piscina({
        filename: path.resolve(`${__dirname}/workers/poc/pooled-async-sleep`),
        minThreads: 2,
        maxThreads: os.cpus().length*2,
        concurrentTasksPerWorker: 10
    });

    const result = await piscina.run("Piscina"); 

    return `${variable} ${result}`;
};
  
export default {
    PocSync,
    PocAsync
}

