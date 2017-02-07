/** @param {int} id */
module.exports = {
  name: 'identify source access points',
  when: [
    events.NEW_SOURCE
  ],
  run: function (event_type, object) {
    let source = Game.getObjectById(object.id);
    let top = source.pos.y - 1;
    let left = source.pos.x - 1;
    let bottom = source.pos.y + 1;
    let right = source.pos.x + 1;

    let objects_in_area = source.room.lookForAtArea(LOOK_TERRAIN, top, left, bottom, right, true);
    for (let index in objects_in_area) {
      let obj = objects_in_area[index];

      console.log(obj.terrain);
      let terrainIsWalkable = obj.terrain == "plain" || obj.terrain == "swamp";
      if (terrainIsWalkable) {
        on.new_source_access_point(source.room.getPositionAt(obj.x, obj.y))
      }
    }
  }
};