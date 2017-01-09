let run_script = function (script, thing) {
  let tasks = require.context('./tasks/', true, /\.js$/);
  let task = tasks(script);
  task.run(thing);
};

let on = function (event_type, object) {
  console.log(`Event ${event_type} triggered for ${JSON.stringify(object)}`);

  let event = {
    type: event_type,
    object: object,
    scripts: Memory.event.event_map[event_type],
  };

  Memory.event.events.push(event);
};

module.exports = {
  run: function () {
    if (Memory.event.events.length == 0)
      return;

    let event = Memory.event.events[0];

    while (event.scripts.length > 0) {
      let script = event.scripts[0];

      let object = event.object;

      console.log(`Running ${script}`);
      run_script(script, object);

      event.scripts.shift();
    }

    Memory.event.events.shift();
  },
  events: {
    NEW_ROOM: 'new_room',
    NEW_SOURCE: 'new_source',
    NEW_SOURCE_ACCESS_POINT: 'nsap'
  },

  new_room: function (name) {
    on(this.events.NEW_ROOM, {room: name});
  },
  new_source: function (source) {
    on(this.events.NEW_SOURCE, {id: source.id});
  },
  new_source_access_point: function (position) {
    if (!(position.roomName in Memory.access_points)) {
      Memory.access_points[position.roomName] = {};
    }

    if (!(position.x in Memory.access_points[position.roomName])) {
      Memory.access_points[position.roomName][position.x] = {};
    }

    Memory.access_points[position.roomName][position.x][position.y] = {
      position: position
    };

    on(this.events.NEW_SOURCE_ACCESS_POINT, position);
  }
};