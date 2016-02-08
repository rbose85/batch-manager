# batch-manager [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Easily batch the execution of functions as promises.

## Installation

```sh
$ npm install --save batch-manager
```

## Usage

```js
var BatchManager = require('batch-manager');

// Create a new `BatchManager` object, with a 5 task batch size.
var bm = new BatchManager(5);
```

## License

ISC © [Rajiv Bose](https://twitter.com/rbose85)


[npm-image]: https://badge.fury.io/js/batch-manager.svg
[npm-url]: https://npmjs.org/package/batch-manager
[travis-image]: https://travis-ci.org/rbose85/batch-manager.svg?branch=master
[travis-url]: https://travis-ci.org/rbose85/batch-manager
[daviddm-image]: https://david-dm.org/rbose85/batch-manager.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/rbose85/batch-manager
[coveralls-image]: https://coveralls.io/repos/rbose85/batch-manager/badge.svg
[coveralls-url]: https://coveralls.io/r/rbose85/batch-manager
