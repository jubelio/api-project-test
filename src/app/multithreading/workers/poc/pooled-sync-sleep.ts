'use strict';

const sab = new SharedArrayBuffer(4);
const lock = new Int32Array(sab);

export default async (variable: string) => {
  Atomics.wait(lock, 0, 0, 100);
  return `with ${variable}`;
};