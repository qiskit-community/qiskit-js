/**
 * @license
 *
 * Copyright (c) 2017, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const { version } = require('./package');
const utils = require('./lib/utils');
const request = require('./lib/request');
const massageJob = require('./lib/massageJob');
const parser = require('./lib/parser');
const cfg = require('./cfg.json');

const dbg = utils.dbg(__filename);
// To avoid requests that are going to fail to the API.
const errLoginBefore = 'Please use "login" before';

class Cloud {
  constructor(opts = {}) {
    dbg('Starting', opts);

    this.version = version;
    this.uri = process.env.QE_URI || cfg.defaults.uri;

    // Both are also set after a successful login.
    if (opts.token) {
      this.token = opts.token;
    }
    if (opts.userId) {
      this.userId = opts.userId;
    }
  }

  // Token not needed.

  async calibration(name = cfg.defaults.backend.reads) {
    dbg('Getting the calibration info', { name });

    const backName = parser.string(name);

    return request(`${this.uri}/Backends/${backName}/calibration`);
  }

  async parameters(name = cfg.defaults.backend.reads) {
    dbg('Getting the parameters info', { name });

    const backName = parser.string(name);

    return request(`${this.uri}/Backends/${backName}/parameters`);
  }

  async queues(name = cfg.defaults.backend.reads) {
    dbg('Getting the status of the queue for', { name });

    const backName = parser.string(name);

    // TODO: The API returns undefined if the backend doesn´t exists.
    // Using empty object to be consistent with parameters and calibration.
    // return request(`${this.uri}/Backends/${name}/queue/status`);
    const res = await request(`${this.uri}/Backends/${backName}/queue/status`);

    // The message is redundant with the status.
    if (res && res.message) {
      delete res.message;
    }

    return res || {};
  }

  async login(tokenPersonal) {
    dbg('Getting a long term token');

    const t = parser.string(tokenPersonal);

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

    if (!this.token || !this.userId) {
      throw new Error(errLoginBefore);
    }

    const res = await request(`${this.uri}/users/${this.userId}`, {
      token: this.token,
    });

    const creditInfo = res.credit;

    delete creditInfo.promotionalCodesUsed;
    delete creditInfo.lastRefill;
    delete creditInfo.promotional;

    return creditInfo;
  }

  async backend(name = cfg.defaults.backend.reads) {
    dbg('Getting info for a backend', { name });

    if (!this.token) {
      throw new Error(errLoginBefore);
    }

    // TODO: The API returns undefined if the backend doesn´t exists.
    // Using empty object to be consistent with parameters and calibration.
    // return  request(`${this.uri}/Backends/${parser.string(name)}`, { token: this.token });
    const res = await request(`${this.uri}/Backends/${parser.string(name)}`, {
      token: this.token,
    });

    return res || {};
  }

  async backends(onlySims = false) {
    dbg('Getting the available backends', { onlySims });

    if (!this.token) {
      throw new Error(errLoginBefore);
    }
    if (onlySims) {
      parser.bool(onlySims);
    }

    let res = await request(`${this.uri}/Backends`, { token: this.token });
    // TODO: This endpoint doesn´t allow the filter param.
    res = utils.filter(res, el => el.status === 'on');

    if (onlySims) {
      dbg('Returning only the simulators');

      return utils.filter(
        res,
        el => el.status === 'on' && el.simulator === true,
      );
    }

    return res;
  }

  async run(circuit, opts = {}) {
    dbg('Running experiment ...');

    if (!this.token || !this.userId) {
      throw new Error(errLoginBefore);
    }

    dbg('Parsing mandatory params ...', { circuit });
    let qasm = parser.string(circuit);
    // TODO: Dirty trick because the API adds this line again.
    qasm = qasm.replace('IBMQASM 2.0;', '').replace('OPENQASM 2.0;', '');

    dbg('Parsing optional params ...', opts);

    let backend;
    if (opts.backend) {
      backend = parser.string(opts.backend);
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
      reqOpts.body.shots = parser.number(
        opts.shots,
        cfg.limits.shots[0],
        cfg.limits.shots[1],
      );
    } else {
      reqOpts.body.shots = cfg.defaults.shots;
    }
    if (opts.seed) {
      reqOpts.body.seed = parser.string(opts.seed);
    }
    if (opts.maxCredits) {
      reqOpts.body.maxCredits = parser.number(opts.maxCredits, 0);
    }
    if (opts.name) {
      reqOpts.body.qasms[0].name = parser.string(opts.name);
    }

    dbg('Making the request ...', reqOpts);
    const res = await request(`${this.uri}/Jobs`, reqOpts);

    dbg('Massaging the result ...', res);
    // TODO: Add info about the status of the job in the queue.
    const resMassaged = { id: res.id, status: res.status };
    // To avoid a break if any API error or something.
    if (res.qasms && res.qasms[0] && res.qasms[0]) {
      resMassaged.name = res.qasms[0].name;
    }

    dbg('Massaged ...', resMassaged);
    return resMassaged;
  }

  async runBatch(circuits, opts = {}) {
    dbg('Running batch of experiment ...', { circuits, opts });

    if (!this.token || !this.userId) {
      throw new Error(errLoginBefore);
    }

    dbg('Parsing mandatory params ...', { circuits });

    let qasms;
    if (!circuits || !utils.isArray(circuits) || utils.isEmpty(circuits)) {
      throw new Error(`Array format expected, found: ${circuits}`);
    } else {
      qasms = utils.map(circuits, el => {
        // TODO: Dirty trick because the API adds this line again.
        if (!utils.isObject(el)) {
          throw new Error(`Object format expected: ${el}`);
        }
        const parsed = {
          qasm: parser
            .string(el.qasm)
            .replace('IBMQASM 2.0;', '')
            .replace('OPENQASM 2.0;', ''),
        };
        if (el.shots) {
          parsed.shots = parser.number(
            el.shots,
            cfg.limits.shots[0],
            cfg.limits.shots[1],
          );
        }
        if (el.seed) {
          parsed.seed = parser.string(el.seed);
        }
        if (el.name) {
          parsed.name = parser.string(el.name);
        }

        return parsed;
      });
    }

    dbg('Parsing optional params ...', opts);

    let backend;
    if (opts.backend) {
      backend = parser.string(opts.backend);
    } else {
      backend = cfg.defaults.backend.run;
    }

    let shots;
    if (opts.shots) {
      shots = parser.number(
        opts.shots,
        cfg.limits.shots[0],
        cfg.limits.shots[1],
      );
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

    if (opts.seed) {
      reqOpts.body.seed = parser.string(opts.seed);
    }

    if (opts.maxCredits) {
      reqOpts.body.maxCredits = parser.number(opts.maxCredits, 0);
    }

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

    if (!this.token) {
      throw new Error(errLoginBefore);
    }

    const res = await request(`${this.uri}/Jobs/${parser.string(id)}`, {
      token: this.token,
    });

    return massageJob(res);
  }

  async jobs(limit = 50, skip) {
    dbg('Getting the jobs');

    if (!this.token) {
      throw new Error(errLoginBefore);
    }

    const reqOpts = {
      token: this.token,
      filter: { order: 'creationDate DESC' },
    };
    if (limit) {
      reqOpts.filter.limit = parser.number(limit, 0);
    }
    if (skip) {
      reqOpts.filter.skip = parser.number(skip, 0);
    }

    const res = await request(`${this.uri}/Jobs`, reqOpts);

    return res.map(massageJob);
  }
}

module.exports = Cloud;
