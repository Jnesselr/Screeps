/** {StructureTower} tower */
module.exports = {
  key: 'tower',
  type: roleType.TOWER,
  run: function (tower) {
    let things_to_repair =
      Object.keys(Memory.structures.roads)
      .map(function(road_id) {
        return Game.getObjectById(road_id)
      })
      .filter(function(road) {
        if (road == null)
          return false;

        return road.hits < (road.hitsMax - 800);
      })
      .sort(function(a, b) {
        let a_ratio = a.hits / a.hitsMax;
        let b_ratio = b.hits / b.hitsMax;
        return a_ratio - b_ratio;
      });

    if(things_to_repair) {
      // console.log(`Repairing ${things_to_repair[0].pos}`);
      tower.repair(things_to_repair[0]);
    }
  }
};