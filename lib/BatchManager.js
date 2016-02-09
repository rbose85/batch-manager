'use strict';

var Q = require('q');
var Task = require('./Task');

var exec = function executeBatch(batch) {
  return Q.allSettled(batch.map(function (item) {
    return item.invoke();
  }));
};

var proc = function processBatchResult(offset, batch, batchResults) {
  var stubs = [];     // protect order or results
  var resolves = [];  // will need to be reinserted
  var rejects = [];   // will need to be queued again

  batchResults.forEach(function (result, index) {
    var task = batch[index]; // result's Task

    if (result.state === 'fulfilled') {
      if (!task.isReject) {
        return stubs.push(result.value);
      }

      return resolves.push({
        queueIndex: task.queueIndex,
        value: result.value
      });
    }

    if (result.state === 'rejected') {
      if (!task.isReject) {
        // only set the original queue index once
        task.queueIndex = offset + index;
        task.isReject = true;

        // ensure placeholder for first time reject
        stubs.push(result.value);
      }

      return rejects.push(task);
    }
  });

  return Q.resolve({
    placeholders: stubs,
    reinsertCompleted: resolves,
    appendToQueue: rejects
  });
};

function BatchManager(batchSize) {
  var queue = [];
  var size = batchSize || 10;
  var state = 'unlocked';

  Object.defineProperty(this, 'isLocked', {
    get: function () {
      return state === 'locked';
    }
  });

  Object.defineProperty(this, 'state', {
    set: function (value) {
      if (typeof value !== 'string') {
        throw new Error('Invalid type. Expected type `string`.');
      }

      if (value !== 'locked' && value !== 'unlocked') {
        throw new Error('Invalid value.');
      }

      if (value === 'unlocked' && queue.length > 0) {
        throw new Error('Cannot "unlock" whilst processing queue.');
      }

      state = value;
    }
  });

  Object.defineProperty(this, 'size', {
    get: function () {
      return size;
    }
  });

  Object.defineProperty(this, 'queue', {
    get: function () {
      return queue;
    },
    set: function (tasks) {
      queue = tasks;
    }
  });
}

BatchManager.prototype.add = function (fn, params, context) {
  if (this.isLocked) {
    throw new Error('BatchManager is currently running. Cannot execute add() method.');
  }
  this.queue.push(new Task(fn, params, context));
};

BatchManager.prototype.run = function () {
  var self = this;
  var completed = [];
  var deferred = Q.defer();

  if (self.isLocked) {
    throw new Error('BatchManager is currently running. Cannot execute run() method.');
  }

  var next = function () {
    // an empty queue means all tasks have been completed
    if (self.queue.length === 0) {
      return Q.resolve();
    }

    console.log('\n--rb-- next() remaining: ', self.queue.length); // eslint-disable-line no-console
    var batch = self.queue.splice(0, self.size);

    return exec(batch)
      .then(function (results) {
        return proc(completed.length, batch, results);
      })
      .then(function (results) {
        if (results.placeholders.length > 0) {
          completed = completed.concat(results.placeholders);
        }

        results.reinsertCompleted.forEach(function (item) {
          completed[item.queueIndex] = item.value;
        });

        if (results.appendToQueue.length > 0) {
          self.queue = self.queue.concat(results.appendToQueue);
        }

        console.log('--rb-- completed: ', completed.length); // eslint-disable-line no-console
        return Q.resolve();
      })
      .then(next);
  };

  next()
    .then(function () {
      self.state = 'unlocked';
      return deferred.resolve(completed);
    });

  return deferred.promise;
};

module.exports = BatchManager;
