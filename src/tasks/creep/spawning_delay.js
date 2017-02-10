module.exports = {
  name: 'spawning delay',
  when: [
    events.NEW_CREEP_SPAWNING
  ],
  run: function (event_type, object) {
    let spawn_name = object.spawn;
    let creep_name = object.creep;

    /** @type {Creep} creep */
    let creep = Game.creeps[creep_name];

    // Somehow we said we were spawning a creep that didn't exist
    if (creep == null)
      return;

    /** @type {Spawn} spawn */
    let spawn = Game.spawns[spawn_name];

    if (creep.spawning) {
      let gameTickToCheck = spawn.spawning.remainingTime + Game.time;

      on.game_tick(gameTickToCheck, this.name, object);
      console.log(`Creep ${creep_name} is still spawning, checking again: ${gameTickToCheck}`)
    } else {
      on.new_creep(creep_name);
      console.log(`Creep ${creep_name} has been spawned`)
    }
  }
};