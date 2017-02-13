/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.resource_fetch');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  fetch_closest_dropped_energy: function (creep) {
    let target = creep.room.find(FIND_DROPPED_ENERGY);

    if (target) {
      let resource = target[0];
      if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
        if (creep.fatigue == 0) {
          creep.moveTo(resource, {
            visualizePathStyle: {
              stroke: '#fffe00',
              strokeWidth: .15,
              opacity: .75
            }
          });
        }
      }
    }

    // TODO Grab energy from container if it's closer
  }
};