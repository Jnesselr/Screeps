let manager = require('../event_manager');

/** @param {string} room_name */
module.exports = {
  on: [
    manager.events.NEW_ROOM
  ],
  run: function (obj) {
    let room = Game.rooms[obj.room];
    console.log(`${JSON.stringify(obj)} - ${JSON.stringify(room)}`);
    let sources = room.find(FIND_SOURCES);

    for (let index in sources) {
      let source = sources[index];

      manager.new_source(source)
    }
  }
};