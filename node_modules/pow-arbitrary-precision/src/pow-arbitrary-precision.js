/*jshint node:true */

'use strict';

var binaryOpExtender = require('binary-op-arbitrary-precision');

module.exports = function factory(Decimal) {
  return binaryOpExtender(Decimal, 'pow');
};
