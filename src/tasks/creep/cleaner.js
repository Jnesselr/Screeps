module.exports = {
  name: 'creep cleanup',
  when: [
    events.NEW_CREEP
  ],
  run: function (event_type, object) {
    let creep_name = object.creep;

    /** @type {Creep} creep */
    let creep = Game.creeps[creep_name];

    if (creep == null) {
      // Creep isn't in the game, clear the memory
      delete Memory.creeps[creep_name];
      console.log(`Cleared ${creep_name} from memory`);
    } else {
      // Call this script again when ticks to live is 0
      let gameTickToCheck = creep.ticksToLive + Game.time;

      on.game_tick(gameTickToCheck, this.name, object);
      console.log(`Running cleaner on ${creep_name} again: ${gameTickToCheck}`);
    }
  }
};