var resource_fetch = require('./../utils/resource_fetch.js');

module.exports = {
  key: 'basic_upgrader',
  /** @param {Spawn} spawn **/
  needed: function (spawn) {
    return 1;
  },
  body: [CARRY, CARRY, CARRY, WORK, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    // switch (creep.memory.state) {
    //   case 'Init':
    //
    // }
    if (creep.memory.upgrading) {
      let result = creep.upgradeController(creep.room.controller);

      if (result == ERR_NOT_IN_RANGE) {
        if (creep.fatigue == 0)
          creep.moveTo(creep.room.controller);
      } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.upgrading = false;
      }
    } else {
      if (creep.carry.energy < creep.carryCapacity) {
        resource_fetch.fetch_closest_dropped_energy(creep);
      } else {
        creep.memory.upgrading = true
      }
    }
  }
};