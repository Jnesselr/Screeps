let resource_fetch = require('./../../utils/resource_fetch.js');

let container_filter = function (structure) {
  return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
    (structure.structureType == STRUCTURE_CONTAINER && structure.energy < structure.storeCapacity) ||
    (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity) ||
    (structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity)
};

const fill_order = [
  STRUCTURE_TOWER,
  STRUCTURE_SPAWN,
  STRUCTURE_EXTENSION,
  STRUCTURE_STORAGE,
];

let container_sort = function(a, b) {
  if(a.structureType == STRUCTURE_SPAWN || a.structureType == STRUCTURE_EXTENSION) {
    if (a.room.energyAvailable < 600)
      return -1
  }

  if(b.structureType == STRUCTURE_SPAWN || b.structureType == STRUCTURE_EXTENSION) {
    if (b.room.energyAvailable < 600)
      return 1;
  }

  let a_order = fill_order.indexOf(a.structureType);
  let b_order = fill_order.indexOf(b.structureType);
  return a_order - b_order;
};

module.exports = {
  key: 'basic_transfer',
  type: roleType.CREEP,
  needed: 2,
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
        if(creep.carry[RESOURCE_ENERGY] == 0)
          creep.memory.state = 'Need_Energy';

        let targets = creep.room.find(FIND_STRUCTURES)
          .filter(container_filter)
          .sort(container_sort);

        if (targets.length > 0) {
          let result = creep.transfer(targets[0], RESOURCE_ENERGY);
          if (result == ERR_NOT_IN_RANGE) {
            if (creep.fatigue == 0)
              creep.moveTo(targets[0], {
                visualizePathStyle: {
                  stroke: '#ff0314',
                  strokeWidth: .15,
                  opacity: .75
                }
              });
          } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.state = 'Need_Energy';
          }
        }
    }
  }
};