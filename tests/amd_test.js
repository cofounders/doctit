'use strict';

var requirejs = require('requirejs');

requirejs.config({
  baseUrl: __dirname + '/..'
});

exports['AMD compatibility'] = {

  default: function (test) {
    requirejs(['doctit'], function (doctit) {
      test.equal(typeof doctit, 'object');
      test.done();
    });
  }

};
