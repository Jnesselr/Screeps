const resource_fetch = require('./../utils/resource_fetch.js');

const build_order = [
  STRUCTURE_ROAD,
  STRUCTURE_EXTENSION,
  STRUCTURE_CONTAINER,
  STRUCTURE_WALL,
  STRUCTURE_RAMPART
];

module.exports = {
  key: 'basic_builder',
  /** @param {Spawn} spawn **/
  needed: function (spawn) {
    return 3;
  },
  body: [CARRY, WORK, MOVE, MOVE, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    let target;
    if (creep.memory.building) {
      if (creep.memory.target === null || typeof creep.memory.target === "undefined") {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);

        targets = targets.sort((a, b) => {
          // TODO this fails when a structure isn't in our dictionary
          a_order = build_order.indexOf(a.structureType);
          b_order = build_order.indexOf(b.structureType);
          return a_order - b_order;
        });

        if (targets.length > 0) {
          target = targets[0];
          console.log(`${creep.name} targeting ${target.structureType} at ${JSON.stringify(target.pos)} to build against`);

          if (target) {
            creep.memory.target = target.id;
            creep.say(target.structureType);
          }
        }
      }

      target = Game.getObjectById(creep.memory.target);
      if (target) {
        let result = creep.build(target);
        if (result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
          creep.memory.building = false;
          creep.memory.target = null;
        }
      } else {
        creep.memory.building = false;
        creep.memory.target = null;
      }
    } else {
      if (creep.carry.energy < creep.carryCapacity) {
        resource_fetch.fetch_closest_dropped_energy(creep);
      } else {
        creep.memory.building = true
      }
    }
  }
};