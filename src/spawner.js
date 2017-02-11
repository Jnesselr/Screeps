/**
 * @param {Spawn} spawn
 **/

let role_context = context.role();

module.exports = function (spawn) {
  let roles = Memory.role.type_name_map[roleType.CREEP];

  roles.forEach(function (role_name) {
    let filename = Memory.role.name_file_map[role_name];
    let creep_template = role_context(filename);

    let creeps_of_type = _.filter(Game.creeps, (creep) => creep.memory.role == creep_template.key);

    let needed = creep_template.needed;
    if (typeof(needed) == 'function') {
      needed = needed(spawn);
    }

    let memory = {};
    if (typeof(creep_template.memory) == 'function') {
      memory = creep_template.memory()
    }

    memory['role'] = creep_template.key;
    memory['state'] = 'Init';

    if (creeps_of_type.length < needed) {
      if (spawn.canCreateCreep(creep_template.body) == OK) {
        let result = spawn.createCreep(creep_template.body, null, memory);
        if (isNaN(result)) {
          console.log(`Spawning ${result} from Spawn1 as ${creep_template.key}`);
          on.new_creep_spawning(spawn.name, result);
        }
      }
    }
  })
};