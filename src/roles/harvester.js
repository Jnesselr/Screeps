module.exports = {
  key: 'basic_harvester',
  needed: 1,
  body: [WORK, WORK, MOVE],

  /** @param {Creep} creep **/
  run: function (creep) {
    // switch (creep.memory.state) {
    //   case 'Init':
    //     // We were just spawned, so we need to try to find the closest spot to go to
    //
    //     break;
    //   case 'Harvesting':
    //   // Harvest everything we can
    // }
    let r = creep.room;

    let sources = r.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      if (creep.fatigue == 0)
        creep.moveTo(sources[0]);
    }
  }
};