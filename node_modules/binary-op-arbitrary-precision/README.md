# binary-op-arbitrary-precision

[![Build Status](https://travis-ci.org/javiercejudo/binary-op-arbitrary-precision.svg)](https://travis-ci.org/javiercejudo/binary-op-arbitrary-precision)
[![Coverage Status](https://coveralls.io/repos/javiercejudo/binary-op-arbitrary-precision/badge.svg?branch=master)](https://coveralls.io/r/javiercejudo/binary-op-arbitrary-precision?branch=master)
[![Code Climate](https://codeclimate.com/github/javiercejudo/binary-op-arbitrary-precision/badges/gpa.svg)](https://codeclimate.com/github/javiercejudo/binary-op-arbitrary-precision)

Binary operation abstraction for [core-arbitrary-precision](https://github.com/javiercejudo/core-arbitrary-precision/)

## Install

    npm i binary-op-arbitrary-precision

## Adapters

- See [adapters](https://www.npmjs.com/browse/keyword/core-arbitrary-precision-adapter)

## Usage

```js
var adapter = require('floating-adapter');
var Decimal = require('core-arbitrary-precision')(adapter);
var binaryOpFactory = require('binary-op-arbitrary-precision');

Decimal = binaryOpFactory(Decimal, 'plus');
Decimal = binaryOpFactory(Decimal, 'plus', '+');

new Decimal('2').plus(new Decimal('3')).valueOf(); // => 5
new Decimal('2')['+'](new Decimal('3')).valueOf(); // => 5
```

See [spec](test/spec.js).
