let manager = require('./event_manager');

global.events = {
  NEW_ROOM: 'new_room',
  NEW_SOURCE: 'new_source',
  NEW_SOURCE_ACCESS_POINT: 'nsap'
};

let on_event = function (event_type, object) {
  console.log(`Event ${event_type} triggered for ${JSON.stringify(object)}`);

  let event = {
    type: event_type,
    object: object,
    scripts: Memory.event.event_map[event_type],
  };

  if (Memory.event.events == null)
    Memory.event.events = [];

  Memory.event.events.push(event);
};

global.on = {
  new_room: function (name) {
    on_event(events.NEW_ROOM, {room: name});
  },
  new_source: function (source) {
    on_event(events.NEW_SOURCE, {id: source.id});
  },
  new_source_access_point: function (position) {
    if (Memory.access_points == null) {
      Memory.access_points = {};
    }

    if (Memory.access_points[position.roomName] == null) {
      Memory.access_points[position.roomName] = {}
    }

    if (Memory.access_points[position.roomName][position.x] == null) {
      Memory.access_points[position.roomName][position.x] = {}
    }

    Memory.access_points[position.roomName][position.x][position.y] = {
      position: position
    };

    on_event(events.NEW_SOURCE_ACCESS_POINT, position);
  },
  game_tick: function (game_tick, task_name, object) {
    let task = {
      script: Memory.event.name_source_map[task_name],
      object: object
    };

    if (!(game_tick in Memory.event.tasksOnTick))
      Memory.event.tasksOnTick[game_tick] = [task];
    else
      Memory.event.tasksOnTick[game_tick].push(task);
  }
};

function initialize() {
  // Boot
  console.log('Initializing');

  Memory.event = {
    name_source_map: {},
    event_map: {},
    tasksOnTick: {}
  };

  if (Memory.event['tasksOnTick'] == null) {
    Memory.event.tasksOnTick = {}
  }

  manager.task_context.keys().forEach(function (filename) {
    let task = manager.task_context(filename);

    task.when.forEach(function (event) {
      if (Memory.event.event_map[event] == null) {
        Memory.event.event_map[event] = [];
      }

      Memory.event.event_map[event].push(filename);
      Memory.event.name_source_map[task.name] = filename;
    })
  });

  for (let room in Game.rooms) {
    on.new_room(room);
  }

  Memory.initialized = true;
}

module.exports = function () {
  if (Memory.initialized == null) {
    initialize();
  }
};