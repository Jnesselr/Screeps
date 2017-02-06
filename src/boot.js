let manager = require('./event_manager');

global.events = {
  NEW_ROOM: 'new_room',
  NEW_CREEP: 'new_creep',
  NEW_CREEP_SPAWNING: 'ncs',
  NEW_SOURCE: 'new_source',
  NEW_SOURCE_ACCESS_POINT: 'nsap'
};

let on_event = function (event_type, object) {
  console.log(`Event '${event_type}' triggered for ${JSON.stringify(object)}`);

  let event = {
    type: event_type,
    object: object,
    scripts: Memory.event.event_map[event_type].slice(),
  };

  if (Memory.event.events == null)
    Memory.event.events = [];

  Memory.event.events.push(event);
};

global.on = {
  new_room: function (name) {
    on_event(events.NEW_ROOM, {room: name});
  },
  new_creep: function (name) {
    on_event(events.NEW_CREEP, {creep: name })
  },
  new_creep_spawning: function(spawn_name, creep_name) {
    on_event(events.NEW_CREEP_SPAWNING, {spawn: spawn_name, creep: creep_name})
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

function first_time_initialization() {
  init_event_system();

  for (let room in Game.rooms) {
    on.new_room(room);
  }

  Memory.initialized = true;
}

function init_event_system() {
  if (Memory.event == null) {
    Memory.event = {};
  }

  if (Memory.event.tasksOnTick == null) {
    Memory.event.tasksOnTick = {}
  }

  Memory.event.name_source_map = {};
  Memory.event.event_map = {};

  manager.task_context.keys().forEach(function (filename) {
    console.log(`Loading ${filename}`);
    let task = manager.task_context(filename);

    task.when.forEach(function (event) {
      if (Memory.event.event_map[event] == null) {
        Memory.event.event_map[event] = [];
      }

      Memory.event.event_map[event].push(filename);
      Memory.event.name_source_map[task.name] = filename;
    })
  });
}

module.exports = function () {
  // Cache buster
  if (Memory.cached_hash != '<%= hash %>') {
    console.log('Reinitialization');
    init_event_system();

    Memory.cached_hash = '<%= hash %>';
  }

  if (Memory.initialized == null) {
    console.log('First time Initialization');
    first_time_initialization();
  }
};