/**
 * @param {Spawn} spawn
 * @param {Object} creep_templates
 **/

let role_context = context.role();

module.exports = function (spawn) {
  role_context.keys().forEach(function (filename) {
    let creep_template = role_context(filename);

    // // Ignore anything not a creep
    // if (creep_template.type != roleType.CREEP) {
    //   return
    // }

    let creeps_of_type = _.filter(Game.creeps, (creep) => creep.memory.script == filename);

    let needed = creep_template.needed;
    if (typeof(needed) == 'function') {
      needed = needed(spawn);
    }

    let memory = {};
    if (typeof(creep_template.memory) == 'function') {
      memory = creep_template.memory()
    }
    memory['script'] = filename;
    memory['state'] = 'Init';

    if (creeps_of_type.length < needed) {
      if (spawn.canCreateCreep(creep_template.body) == OK) {
        let result = spawn.createCreep(creep_template.body, null, memory);
        if (isNaN(result)) {
          console.log(`Spawning ${result} from Spawn1 as ${filename}`);
          on.new_creep_spawning(spawn.name, result);
        }
      }
    }
  })
};