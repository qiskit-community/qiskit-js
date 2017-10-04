/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

// TODO: REVIEW ALL REQUESTS TO SEE IF WE CAN ASK ONLY THE FIELDS WE NEED
// const checkToken = require('./lib/checkToken');
const { version } = require('./package');
const utils = require('./lib/utils');
const request = require('./lib/request');
const cfg = require('./cfg.json');


const dbg = utils.dbg(__filename);
// To avoid requests that are going to fail to the API.
const errLoginBefore = 'Please use "login" before';


// TODO: Move the parsers out of here.

function parseNumber(num, min, max) {
  if (!num || typeof num !== 'number') {
    throw new Error(`Number format expected: ${num}`);
  }

  if (((min || min === 0) && num < min) || (max && num > max)) {
    throw new Error(`Out of range: ${num}`);
  }

  return num;
}


function parseString(str) {
  if (!str || typeof str !== 'string') {
    throw new Error(`String format expected: ${str}`);
  }

  return str;
}


function parseBool(value) {
  if (!value || typeof value !== 'boolean') {
    throw new Error(`Boolean format expected: ${value}`);
  }

  return value;
}


function massageJob(resJob) {
  dbg('Massaging the result ...', resJob);

  const result = {
    id: resJob.id,
    backend: resJob.backend.name,
    shots: resJob.shots,
    creationDate: resJob.creationDate,
    usedCredits: resJob.usedCredits,
    status: resJob.status,
    // eslint-disable-next-line arrow-body-style
    circuits: utils.map(resJob.qasms, (el) => {
      const massaged = {
        qasm: el.qasm,
        execution: {
          id: el.executionId,
          status: el.status,
        },
      };

      if (el.name) { massaged.name = el.name; }
      if (el.shots) { massaged.shots = el.shots; }
      if (el.seed) { massaged.seed = el.seed; }
      if (el.result) { massaged.result = el.result; }

      return massaged;
    }),
  };

  if (resJob.maxCredits) { result.maxCredits = resJob.maxCredits; }
  if (resJob.seed) { result.seed = resJob.seed; }

  dbg('Massaged ...', result);
  return result;
}


class Qe {
  constructor(opts = {}) {
    dbg('Starting', opts);

    this.version = version;
    this.uri = process.env.QE_URI || cfg.uri;

    // "token" is also set after a successful login.
    if (opts.token) { this.token = opts.token; }
  }


  // Token not needed.

  async calibration(name = cfg.defaults.backend.reads) {
    dbg('Getting the calibration info', { name });

    const backName = parseString(name);

    return request(`${this.uri}/Backends/${backName}/calibration`);
  }


  async parameters(name = cfg.defaults.backend.reads) {
    dbg('Getting the parameters info', { name });

    const backName = parseString(name);

    return request(`${this.uri}/Backends/${backName}/parameters`);
  }


  async queues(name = cfg.defaults.backend.reads) {
    dbg('Getting the status of the queue for', { name });

    const backName = parseString(name);

    // TODO: The API returns undefined if the backend doesn´t exists.
    // Using empty object to be consistent with parameters and calibration.
    // return request(`${this.uri}/Backends/${name}/queue/status`);
    const res = await request(`${this.uri}/Backends/${backName}/queue/status`);
    return res || {};
  }


  async login(tokenPersonal) {
    dbg('Getting a long term token');

    const t = parseString(tokenPersonal);

    const res = await request(`${this.uri}/users/loginWithToken`, {
      body: { apiToken: t },
    });

    this.token = res.id;
    this.userId = res.userId;

    dbg('Massaging the response', res);
    res.token = res.id;
    delete res.id;

    return res;
  }


  // Token needed.

  async credits() {
    dbg('Getting user credits info');

    if (!this.token || !this.userId) { throw new Error(errLoginBefore); }

    const res = await request(`${this.uri}/users/${this.userId}`, {
      token: this.token,

    });

    const creditInfo = res.credit;

    delete creditInfo.promotionalCodesUsed;
    delete creditInfo.lastRefill;

    return creditInfo;
  }


  async backend(name = cfg.defaults.backend.reads) {
    dbg('Getting info for a backend', { name });

    if (!this.token) { throw new Error(errLoginBefore); }

    // TODO: The API returns undefined if the backend doesn´t exists.
    // Using empty object to be consistent with parameters and calibration.
    // return  request(`${this.uri}/Backends/${name}`, { token: this.token });
    const res = await request(`${this.uri}/Backends/${name}`, { token: this.token });

    return res || {};
  }


  async backends(onlySims = false) {
    dbg('Getting the available backends', { onlySims });

    if (!this.token) { throw new Error(errLoginBefore); }

    let res = await request(`${this.uri}/Backends`, { token: this.token });

    // TODO: This endpoint doesn´t allow the filter param.
    res = utils.filter(res, el => el.status === 'on');

    if (onlySims && parseBool(onlySims)) {
      dbg('Returning only the simulators');

      return utils.filter(res, el => el.status === 'on' && el.simulator === true);
    }

    return res;
  }


  async run(circuit, opts = {}) {
    dbg('Running experiment ...');

    if (!this.token || !this.userId) { throw new Error(errLoginBefore); }

    dbg('Parsing mandatory params ...', { circuit });
    let qasm = parseString(circuit);
    // TODO: Dirty trick because the API adds this line again.
    qasm = qasm.replace('IBMQASM 2.0;', '').replace('OPENQASM 2.0;', '');

    dbg('Parsing optional params ...', opts);

    let backend;
    if (opts.backend) {
      backend = parseString(opts.backend);
    } else {
      backend = cfg.defaults.backend.run;
    }

    const reqOpts = {
      token: this.token,
      body: {
        qasms: [{ qasm }],
        backend: { name: backend },
      },
    };
    if (opts.shots) {
      reqOpts.body.shots = parseNumber(opts.shots, cfg.limits.shots[0], cfg.limits.shots[1]);
    } else {
      reqOpts.body.shots = cfg.defaults.shots;
    }
    if (opts.seed) { reqOpts.body.seed = parseString(opts.seed); }
    if (opts.maxCredits) { reqOpts.body.maxCredits = parseNumber(opts.maxCredits, 0); }
    if (opts.name) { reqOpts.body.qasms[0].name = parseString(opts.name); }

    dbg('Making the request ...', reqOpts);
    const res = await request(`${this.uri}/Jobs`, reqOpts);

    dbg('Massaging the result ...', res);
    // TODO: Add info about the status of the job in the queue.
    const resMassaged = { id: res.id, status: res.status };
    // To avoid a break if any API error or something.
    if (res.qasms && res.qasms[0] && res.qasms[0]) { resMassaged.name = res.qasms[0].name; }

    dbg('Massaged ...', resMassaged);
    return resMassaged;
  }


  async runBatch(circuits, opts = {}) {
    dbg('Running batch of experiment ...', { circuits, opts });

    if (!this.token || !this.userId) { throw new Error(errLoginBefore); }

    dbg('Parsing mandatory params ...', { circuits });

    let qasms;
    if (!circuits || !utils.isArray(circuits) || utils.isEmpty(circuits)) {
      throw new Error(`Array format expected: ${circuits}`);
    } else {
      qasms = utils.map(circuits, (el) => {
        // TODO: Dirty trick because the API adds this line again.
        if (!utils.isObject(el)) {
          throw new Error(`Object format expected: ${el}`);
        }
        const parsed = {
          qasm: parseString(el.qasm).replace('IBMQASM 2.0;', '').replace('OPENQASM 2.0;', ''),
        };
        if (el.shots) {
          parsed.shots = parseNumber(el.shots, cfg.limits.shots[0], cfg.limits.shots[1]);
        }
        if (el.seed) { parsed.seed = parseString(el.seed); }
        if (el.name) { parsed.name = parseString(el.name); }

        return parsed;
      });
    }

    dbg('Parsing optional params ...', opts);

    let backend;
    if (opts.backend) {
      backend = parseString(opts.backend);
    } else {
      backend = cfg.defaults.backend.run;
    }

    let shots;
    if (opts.shots) {
      shots = parseNumber(opts.shots, cfg.limits.shots[0], cfg.limits.shots[1]);
    } else {
      // eslint-disable-next-line prefer-destructuring
      shots = cfg.defaults.shots;
    }

    const reqOpts = {
      token: this.token,
      body: {
        qasms,
        shots,
        backend: { name: backend },
      },
    };

    if (opts.seed) { reqOpts.body.seed = parseString(opts.seed); }

    if (opts.maxCredits) { reqOpts.body.maxCredits = parseNumber(opts.maxCredits, 0); }

    dbg('Making the request ...', reqOpts);
    const res = await request(`${this.uri}/Jobs`, reqOpts);

    dbg('Massaging the result ...', res);

    return {
      id: res.id,
      status: res.status,
    };
  }


  async job(id) {
    dbg('Getting info for a job', { id });

    if (!this.token) { throw new Error(errLoginBefore); }

    const res = await request(`${this.uri}/Jobs/${parseString(id)}`, { token: this.token });

    return massageJob(res);
  }


  async jobs(limit = 50, skip) {
    dbg('Getting the jobs');

    if (!this.token) { throw new Error(errLoginBefore); }

    const reqOpts = {
      token: this.token,
      filter: { order: 'creationDate DESC' },
    };
    if (limit) { reqOpts.filter.limit = parseNumber(limit, 0); }
    if (skip) { reqOpts.filter.skip = parseNumber(skip, 0); }

    const res = await request(`${this.uri}/Jobs`, reqOpts);

    return res.map(massageJob);
  }
}


module.exports = Qe;
