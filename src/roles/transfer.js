var resource_fetch = require('./../utils/resource_fetch.js');

module.exports = {
  key: 'basic_transfer',
  needed: 0,
  body: [CARRY, CARRY, MOVE, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      resource_fetch.fetch_closest_dropped_energy(creep);
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
            (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
            (structure.structureType == STRUCTURE_CONTAINER && structure.energy < structure.storeCapacity);
        }
      });

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          if (creep.fatigue == 0)
            creep.moveTo(targets[0]);
        }
      }
    }
  }
};