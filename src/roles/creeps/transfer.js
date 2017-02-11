let resource_fetch = require('./../../utils/resource_fetch.js');

let container_filter = function (structure) {
  return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
    (structure.structureType == STRUCTURE_CONTAINER && structure.energy < structure.storeCapacity) ||
    (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
};

module.exports = {
  key: 'basic_transfer',
  type: roleType.CREEP,
  needed: 1,
  body: [CARRY, CARRY, MOVE, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    switch (creep.memory.state) {
      case 'Init':
        creep.memory.state = 'Need_Energy';
        break;

      case 'Need_Energy':
        if (creep.carry.energy < creep.carryCapacity) {
          resource_fetch.fetch_closest_dropped_energy(creep);
        } else {
          creep.memory.state = 'Transfer';
        }
        break;

      case 'Transfer':
        let targets = creep.room.find(FIND_STRUCTURES).filter(container_filter);

        if (targets.length > 0) {
          let result = creep.transfer(targets[0], RESOURCE_ENERGY);
          if (result == ERR_NOT_IN_RANGE) {
            if (creep.fatigue == 0)
              creep.moveTo(targets[0]);
          } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.state = 'Need_Energy';
          }
        }
    }
  }
};