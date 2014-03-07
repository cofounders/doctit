'use strict';

exports['CommonJS compatibility'] = {

  default: function (test) {
    test.equal(typeof require('../doctit'), 'object');
    test.done();
  }

};
