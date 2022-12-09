'use strict';

const { promisify } = require('util');
const sleep = promisify(setTimeout);

export default async (variable: string) => {
  await sleep(100);
  return `with ${variable} (async)`;
};