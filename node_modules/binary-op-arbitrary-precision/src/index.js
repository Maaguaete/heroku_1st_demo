/*jshint node:true */

'use strict';

var unsupported = require('unsupported')();
var isUndefined = require('lodash.isundefined');
var identity = require('lodash.identity');

var newDecimalTransformFactory = function newDecimalTransformFactory(Decimal, adapter) {
  return function(x) {
    return new Decimal(adapter.toString(x));
  };
};

var binaryOpExtenderRaw = function binaryOpExtender(transform, Decimal, opName, protoName) {
  var adapter = Decimal.getAdapter();
  var implementation = unsupported;
  var name = isUndefined(protoName) ? opName : protoName;

  transform = transform || newDecimalTransformFactory(Decimal, adapter);

  if (Object.hasOwnProperty.call(adapter, opName)) {
    implementation = function(x) {
      return transform(adapter[opName](this.val(), x.val()));
    };
  }

  Decimal.prototype[name] = implementation;

  return Decimal;
};

var binaryOpExtender = binaryOpExtenderRaw.bind(undefined, undefined);
binaryOpExtender.asIs = binaryOpExtenderRaw.bind(undefined, identity);
binaryOpExtender.raw = binaryOpExtenderRaw;

module.exports = binaryOpExtender;
