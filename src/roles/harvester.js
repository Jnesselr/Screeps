module.exports = {
  key: 'basic_harvester',
  type: roleType.CREEP,
  needed: 2,
  body: [WORK, WORK, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    switch (creep.memory.state) {
      case 'Init':
        creep.memory.state = 'Harvesting';
        break;

      case 'Harvesting':
        let r = creep.room;

        let sources = r.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          if (creep.fatigue == 0)
            creep.moveTo(sources[0]);
        }
        break;
    }
  }
};