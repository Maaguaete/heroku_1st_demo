/*jshint node:true, mocha:true */

'use strict';

require('should');

var adapter = require('floating-adapter');
var Decimal = require('core-arbitrary-precision')(adapter);
var binaryOpExtender = require('../src/');

describe('binary operation', function() {
  it('should do something with two values and return a new decimal by default', function() {
    binaryOpExtender(Decimal, 'plus');
    binaryOpExtender(Decimal, 'plus', '+');
    binaryOpExtender(Decimal, 'div');
    binaryOpExtender(Decimal, 'div', 0);

    new Decimal('2').plus(new Decimal('3')).toString().should.be.exactly('5');
    new Decimal('2')['+'](new Decimal('3')).toString().should.be.exactly('5');

    new Decimal('1')[0](new Decimal('2')).toString().should.be.exactly('0.5');
  });

  it('should be able to return the result of the operation as is', function() {
    binaryOpExtender.asIs(Decimal, 'lt');

    new Decimal('2').lt(new Decimal('3'))
      .should.be.exactly(true);
  });

  it('should be able to return the result of the operation with a custom transform', function() {
    binaryOpExtender.raw(function(x) { return x.toString(); }, Decimal, 'lt');

    new Decimal('4').lt(new Decimal('3'))
      .should.be.exactly('false');
  });

  it('should throw when the given method does not exist', function() {
    binaryOpExtender(Decimal, 'nonExistentMethod');

    (function() {
      new Decimal('2').nonExistentMethod(new Decimal('3'));
    }).should.throw('Unsupported operation');
  });
});
