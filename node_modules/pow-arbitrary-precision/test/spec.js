/*jshint node:true, mocha:true */

'use strict';

require('should');

var adapter = require('floating-adapter');
var Decimal = require('core-arbitrary-precision')(adapter);

Decimal = require('../src/pow-arbitrary-precision')(Decimal);

describe('pow', function() {
  it('should raise to a given power', function() {
    new Decimal('2').pow(new Decimal('3')).valueOf().should.be.exactly(8);
  });
});
