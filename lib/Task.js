'use strict';

var Q = require('q');

function Task(fn, params, context) {
  this.func = fn;
  this.args = params;
  this.context = context;

  this.queueIndex = undefined;
  this.isReject = false;
}

Task.prototype.invoke = function () {
  return Q.resolve(this.func.apply(this.context, this.args));
};

module.exports = Task;
