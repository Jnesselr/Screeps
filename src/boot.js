let system_setup = {
  context: {
    always: function () {
      global.context = {
        task: function () {
          return require.context('./tasks/', true, /\.js$/)
        },
        role: function () {
          return require.context('./roles/', true, /\.js$/);
        }
      };
    }
  },
  structure: {
    init: function () {
      if (Memory.structures == null) {
        Memory.structures = {};
      }

      if(Memory.structures.roads == null) {
        Memory.structures.roads = {};
      }
    }
  },
  role: {
    always: function () {
      global.roleType = {
        CREEP: 'creep',
        TOWER: 'tower'
      };

    },
    init: function () {
      console.log('Role setup called');

      if(Memory.towers == null) {
        Memory.towers = {};
      }

      if (Memory.role == null) {
        Memory.role = {};
      }

      Memory.role.name_file_map = {};
      Memory.role.type_name_map = {};

      let role_context = context.role();

      role_context.keys().forEach(function (filename) {
        let role = role_context(filename);
        console.log(`Role '${filename}' registered for '${role.type}'`);

        Memory.role.name_file_map[role.key] = filename;

        if (Memory.role.type_name_map[role.type] == null) {
          Memory.role.type_name_map[role.type] = [];
        }

        Memory.role.type_name_map[role.type].push(role.key);
      });
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
        NEW_TOWER: 'new_tower',
        NEW_ROAD: 'new_road',
        CONTROLLER_UPGRADE: 'cu',
      };

      let on_event = function (event_type, object) {
        console.log(`Event '${event_type}' triggered for ${JSON.stringify(object)}`);

        let scripts;
        if(Memory.event.event_map[event_type] == null) {
          scripts = []
        } else {
          // Slice causes a copy to be made
          scripts = Memory.event.event_map[event_type].slice();
        }

        let event = {
          type: event_type,
          object: object,
          scripts: scripts,
        };

        if (Memory.event.events == null)
          Memory.event.events = [];

        Memory.event.events.push(event);
      };

      global.on = {
        new_room: function (room) {
          on_event(events.NEW_ROOM, {room: room.name});
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
        construction_complete: function(structure_type, pos) {
          let room = Game.rooms[pos.roomName];
          let structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);

          structures.forEach(function(structure) {
            if(structure.structureType == structure_type) {
              console.log(`New ${structure_type} completed at ${structure.pos}`);
              switch(structure_type) {
                case STRUCTURE_ROAD:
                  on.new_road(structure);
                  break;
                case STRUCTURE_TOWER:
                  on.new_tower(structure);
                  break;
              }
            }
          });
        },
        new_tower: function(tower) {
          if(Memory.towers[tower.id] == null) {
            Memory.towers[tower.id] = {
              role: 'tower'
            };

            on_event(events.NEW_TOWER, {id: tower.id})
          }
        },
        new_road: function(road) {
          // Don't re-discover known roads

          if(Memory.structures.roads[road.id] == null) {
            Memory.structures.roads[road.id] = {};
            on_event(events.NEW_ROAD, {id: road.id})
          }
        },
        game_tick: function (game_tick, task_name, object) {
          let task = {
            name: task_name,
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

      // First fill in empty events
      Object.keys(global.events).forEach(function (event_key) {
        let event = global.events[event_key];

        Memory.event.event_map[event] = []
      });

      // Then add the scripts to the correct event
      let task_context = context.task();

      task_context.keys().forEach(function (filename) {
        let task = task_context(filename);

        task.when.forEach(function (event) {
          console.log(`Event '${event}' registered for '${filename}'`);

          Memory.event.event_map[event].push(filename);
          Memory.event.name_source_map[task.name] = filename;
        })
      });
    }
  }
};

function init() {
  system_setup.event.init();
  system_setup.role.init();
  system_setup.structure.init();
}

module.exports = function () {
  system_setup.context.always();
  system_setup.event.always();
  system_setup.role.always();

  if (Memory.first_time_init_done == null) {
    console.log('First time Initialization');
    init();

    Object.keys(Game.rooms).forEach(function(room_name) {
      on.new_room(Game.rooms[room_name]);
    });

    Memory.first_time_init_done = true;

  } else if (Memory.cached_hash != '<%= hash %>') {
    // Cache buster

    console.log('Reinitialization');
    init();

    Memory.cached_hash = '<%= hash %>';
  }

  global.systemIsUp = true;

  // one time code
  let lookForStructures = Game.rooms['W3S88'].lookForAtArea(LOOK_STRUCTURES, 0, 0, 49, 49, true);
  lookForStructures.forEach(function(look_at) {
    let structure = look_at.structure;
    if (structure.structureType == STRUCTURE_ROAD) {
      on.new_road(structure);
    }
  });
};