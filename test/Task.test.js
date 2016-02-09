'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);

var Task = require('../lib/Task');

describe('Task', function () {
  var task;
  var func = sinon.spy();
  var params = ['some', 'random', 'params'];
  var context = { obj: 'this', and: 'that' };
  var invoked;

  describe('constructor', function () {
    before(function () {
      task = new Task(func, params, context);
    });

    it('should initialise fn to argument value', function () {
      chai.assert.equal(task.func, func);
    });

    it('should initialise params to argument value', function () {
      chai.assert.equal(task.args, params);
    });

    it('should initialise contest to argument value', function () {
      chai.assert.deepEqual(task.context, context);
    });

    it('should initialise queueIndex to undefined', function () {
      chai.assert.equal(task.queueIndex, undefined);
    });

    it('should initialise isReject to false', function () {
      chai.assert.equal(task.isReject, false);
    });
  });

  describe('#invoke', function () {
    before(function () {
      task = new Task(func, params, context);
      invoked = task.invoke();
    });

    it('should return a resolved promise', function () {
      chai.assert.isFulfilled(invoked);
    });

    it('should have invoked fn with params and content', function () {
      chai.assert.ok(func.calledOnce);
      chai.assert.deepEqual(func.args[0], params);
      chai.assert.ok(func.calledOn(context));
    });
  });
});
