/** @param {int} id */
module.exports = {
  name: 'identify source access points',
  when: [
    // events.NEW_SOURCE
  ],
  run: function (object) {
    let source = Game.getObjectById(object.id);
    let top = source.pos.y - 1;
    let left = source.pos.x - 1;
    let bottom = source.pos.y + 1;
    let right = source.pos.x + 1;

    let objects_in_area = source.room.lookAtArea(top, left, bottom, right, true);
    for (let index in objects_in_area) {
      let obj = objects_in_area[index];
      if (obj.type == 'terrain') {
        let terrainIsWalkable = obj.terrain & (TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP) != 0;
        if (terrainIsWalkable) {
          on.new_source_access_point(source.room.getPositionAt(obj.x, obj.y))
        }
      }
    }
  }
};