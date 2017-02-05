// Initialize stuff
require('./boot')();

let spawner = require('./spawner');
let runner = require('./runner');
let manager = require('./event_manager');

module.exports.loop = function () {
  while (Game.cpu.getUsed() < Game.cpu.limit) {
    manager.run();
  }
};