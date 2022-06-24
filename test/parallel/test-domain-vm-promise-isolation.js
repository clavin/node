'use strict';

const common = require('../common');
const domain = require('domain');
const vm = require('vm');

// A promise created in a VVM should not track back into the parent.
//
// See; https://github.com/nodejs/node/issues/40999

const context = vm.createContext({});

function run(code) {
  const d = domain.createDomain();
  d.run(common.mustCall(() => {
    vm.runInContext(code, context)()
      .then(common.mustCall(() => { }));
  }));
}

for (let i = 0; i < 1000; i++) {
  run('async () => null');
}
