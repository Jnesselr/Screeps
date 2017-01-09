let tasks = require.context('./tasks/', true, /\.js$/);
module.exports = function () {
  console.log('booting!');
  if (Memory.initialized == null) {
    // Boot
    Memory.event = {
      event_map: {},
      events: []
    };

    tasks.keys().forEach(function(filename) {
      let task = tasks(filename);

      task.on.forEach(function(event) {
        if(!(event in Memory.event.event_map))
          Memory.event.event_map[event] = [];

        Memory.event.event_map[event].push(filename);
      })
    });

    Memory.access_points = {};

    Memory.tasks = {};

    Memory.tasksOnTick = {};

    Memory.initialized = true;
  }
};