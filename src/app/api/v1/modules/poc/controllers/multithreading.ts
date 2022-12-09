import ResponseHelper from '@rpc/response';
import Multithreading from '@multithreading/main'

const noMultithreadingSync = async (request, reply) => {
  const sab = new SharedArrayBuffer(4);
  const lock = new Int32Array(sab);
  Atomics.wait(lock, 0, 0, 100);
  ResponseHelper.sendResponseHTTP(reply, 200, "No Multithreading");
};

const multithreadingPiscinaSync = async (request, reply) => {
  const result = await Multithreading.PocSync("Multithreading");
  ResponseHelper.sendResponseHTTP(reply, 200, result);
};

const noMultithreadingAsync = async (request, reply) => {
  const { promisify } = require('util');
  const sleep = promisify(setTimeout);
  await sleep(100);
  ResponseHelper.sendResponseHTTP(reply, 200, "No Multithreading (async)");
};

const multithreadingPiscinaAsync = async (request, reply) => {
  const result = await Multithreading.PocAsync("Multithreading");
  ResponseHelper.sendResponseHTTP(reply, 200, result);
};

export default {
  noMultithreadingSync,
  multithreadingPiscinaSync,
  noMultithreadingAsync,
  multithreadingPiscinaAsync
}
