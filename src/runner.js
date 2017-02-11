let role_context = context.role();

module.exports = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];

    if(creep.spawning)
      continue;

    let filename = Memory.role.name_file_map[creep.memory.role];
    let script = role_context(filename);

    script.run(creep);
  }
};