'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);


var BatchManager = rewire('../lib/BatchManager');
var exec = BatchManager.__get__('exec');

describe('#exec', function () {
  var batch = [];
  var result;

  before(function () {
    for (var i = 0; i < 10; i++) {
      batch.push({
        invoke: sinon.stub().returns(i)
      });
    }
    result = exec(batch);
  });

  it('should call invoke once for each batch item', function () {
    batch.forEach(function (item) {
      chai.assert.ok(item.invoke.calledOnce);
    });
  });

  it('should return a fulfilled Promise that resolves to an array of index', function () {
    chai.assert.isFulfilled(result);
    chai.assert.becomes(result, batch.map(function (item, index) { return index; }));
  });
});
