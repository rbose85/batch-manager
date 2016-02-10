# batch-manager [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Easily batch the execution of functions as promises.

## Installation

```sh
$ npm install --save batch-manager
```

## Usage

```js
var BatchManager = require('./BatchManager');
var Q = require('q');
var request = Q.denodeify(require('request'));


var httpGet = function (uri, options) {
  var opts = Object.assign({}, options, { method: 'GET', uri: uri });

  return request(opts)
    .spread(function (resp) {
      return resp;
    });
};


// Create a new `BatchManager` object, with a 5 task batch size.
var bm = new BatchManager(5);

for (var i = 0; i < 20; i++) {
  var args = ['http://api.randomuser.me/', { qs: { gender: 'female' } }];

  // Add functions to the `BatchManager`'s internal queue.
  bm.add(httpGet, args);
}

// Launch the `BatchManager` into action - the queued set of functions are invoked in batches.
bm.run()
  .then(function (responses) {
    return Q.all(responses.map(function (resp) {
      var code = resp.statusCode;
      var data = JSON.parse(resp.body);

      if (code < 200 || code > 299) {
        return Q.reject(data.error);
      }

      return Q.resolve(data.results[0].user);
    }));
  })
  .then(function (users) {
    return users.map(function (user) {
      return {
        name: user.name.first + ' ' + user.name.last,
        email: user.email,
        image: user.picture.thumbnail
      };
    });
  })
  .then(function (users) {
    return users.map(function (simpleUser) {
      console.log(JSON.stringify(simpleUser)); // eslint-disable-line no-console
    });
  });
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
