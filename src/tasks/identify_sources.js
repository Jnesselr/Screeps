let manager = require('../event_manager');

/** @param {string} room_name */
module.exports = {
  name: 'identify sources',
  when: [
    events.NEW_ROOM
  ],
  run: function (event_type, object) {
    let room = Game.rooms[object.room];
    console.log(`${JSON.stringify(object)} - ${JSON.stringify(room)}`);
    let sources = room.find(FIND_SOURCES);

    for (let index in sources) {
      let source = sources[index];

      on.new_source(source)
    }
  }
};