let manager = require('./event_manager');

let system_setup = {
  role: {
    always: function () {
      global.roleType = {
        CREEP: 'creep',
        TOWER: 'tower'
      };

    },
    init: function () {
      Memory.roles = {};
    }
  },
  event: {
    always: function () {
      global.events = {
        GAME_TICK: 'game_tick',
        NEW_ROOM: 'new_room',
        NEW_CREEP: 'new_creep',
        NEW_CREEP_SPAWNING: 'ncs',
        NEW_SOURCE: 'new_source',
        NEW_SOURCE_ACCESS_POINT: 'nsap',
        CONTROLLER_UPGRADE: 'cu'
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
          on_event(events.NEW_CREEP, {creep: name})
        },
        new_creep_spawning: function (spawn_name, creep_name) {
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
        },
        controller_upgrade: function (controller) {
          on_event(events.CONTROLLER_UPGRADE, {id: controller.id})
        }
      };
    },
    init: function () {
      console.log('Event setup called');

      if (Memory.event == null) {
        Memory.event = {};
      }

      if (Memory.event.tasksOnTick == null) {
        Memory.event.tasksOnTick = {}
      }

      Memory.event.name_source_map = {};
      Memory.event.event_map = {};

      manager.task_context.keys().forEach(function (filename) {
        let task = manager.task_context(filename);

        task.when.forEach(function (event) {
          console.log(`Event '${event}' registered for '${filename}'`);

          if (Memory.event.event_map[event] == null) {
            Memory.event.event_map[event] = [];
          }

          Memory.event.event_map[event].push(filename);
          Memory.event.name_source_map[task.name] = filename;
        })
      });
    }
  }
};

function first_time_initialization() {
  system_setup.event.init();
  system_setup.role.init();

  for (let room in Game.rooms) {
    on.new_room(room);
  }

  Memory.first_time_init_done = true;
}

module.exports = function () {
  system_setup.event.always();
  system_setup.role.always();

  if (Memory.first_time_init_done == null) {
    console.log('First time Initialization');
    first_time_initialization();
  } else if (Memory.cached_hash != '<%= hash %>') {
    // Cache buster

    console.log('Reinitialization');
    system_setup.event.init();
    system_setup.role.init();

    Memory.cached_hash = '<%= hash %>';
  }

  global.systemIsUp = true;
};