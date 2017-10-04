/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const utils = require('./utils');


const dbg = utils.dbg(__filename);


module.exports = (resJob) => {
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
};
