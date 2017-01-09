// Initialize stuff
require('./boot')();

let spawner = require('./spawner');
let cleaner = require('./cleaner');
let runner = require('./runner');

let event = require('./event_manager');

if (Memory.roomed == null) {
  for (let room_name in Game.rooms) {
    event.new_room(room_name);
  }

  Memory.roomed = true;
}

module.exports.loop = function () {
  // console.log(JSON.stringify(Game.cpu));
  // console.log(Game.time);

  // Cleaner
  cleaner();

  event.run();

  // Spawner
  let spawn = Game.spawns['Spawn1'];
  spawner(spawn);

  // Runner
  // runner(creep_templates);
};