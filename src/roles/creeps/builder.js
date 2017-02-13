const resource_fetch = require('./../../utils/resource_fetch.js');

const build_order = [
  STRUCTURE_ROAD,
  STRUCTURE_EXTENSION,
  STRUCTURE_STORAGE,
  STRUCTURE_CONTAINER,
  STRUCTURE_WALL,
  STRUCTURE_RAMPART
];

module.exports = {
  key: 'basic_builder',
  type: roleType.CREEP,
  /** @param {Spawn} spawn **/
  needed: function (spawn) {
    return 3;
  },
  body: [CARRY, WORK, MOVE, MOVE, MOVE],

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
          creep.memory.state = 'Find_Target';
        }
        break;

      case 'Find_Target':
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);

        targets = targets.sort((a, b) => {
          // TODO this fails when a structure isn't in our dictionary
          let a_order = build_order.indexOf(a.structureType);
          let b_order = build_order.indexOf(b.structureType);
          return a_order - b_order;
        });

        // console.log(JSON.stringify(targets));

        if (targets.length > 0) {
          let target = targets[0];
          console.log(`${creep.name} targeting ${target.structureType} at ${JSON.stringify(target.pos)} to build against`);

          if (target) {
            creep.memory.target = target.id;
            creep.memory.target_type = target.structureType;
            creep.memory.target_pos = target.pos;
            creep.memory.state = 'Building';

            creep.say(target.structureType);
          }
        }
        break;

      case 'Building':
        let target = Game.getObjectById(creep.memory.target);

        if (target) {
          let result = creep.build(target);
          if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
              visualizePathStyle: {
                stroke: '#00a4ff',
                strokeWidth: .15,
              }
            });
          } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.state = 'Need_Energy';
          }
        } else {
          // The construction site has been completed
          on.construction_complete(creep.memory.target_type, creep.memory.target_pos);

          creep.memory.state = 'Find_Target';
        }
        break;
    }
  }
};