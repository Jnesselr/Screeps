let role_context = context.role();

module.exports = function () {
  Object.keys(Game.creeps).forEach(function (name) {
    let creep = Game.creeps[name];

    if(creep.spawning)
      return;

    let filename = Memory.role.name_file_map[creep.memory.role];
    let script = role_context(filename);

    script.run(creep);
  });
};