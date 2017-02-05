let manager = require('../event_manager');

/** @param {RoomPosition} pos */
module.exports = {
  name: 'make road to source',
  when: [
    // manager.events.NEW_SOURCE_ACCESS_POINT
  ],
  run: function (object) {
    let pos = Game.rooms[object.roomName].getPositionAt(object.x, object.y);

    let found_path = PathFinder.search(
      Game.spawns['Spawn1'].pos, // TODO Make this spawn variable
      pos
    );
    if (found_path.incomplete) {
      console.log(JSON.stringify(found_path));
      return;
    }

    Memory.access_points[pos.roomName][pos.x][pos.y]['path'] = found_path;

    let path = found_path.path;

    for (let index in path) {
      let site = path[index];
      let room = Game.rooms[site.roomName];

      room.createConstructionSite(site, STRUCTURE_ROAD);
    }
  }
};