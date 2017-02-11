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

  Object.keys(Memory.towers).forEach(function(tower_id) {
    let tower_memory = Memory.towers[tower_id];
    let filename = Memory.role.name_file_map[tower_memory.role];
    let script = role_context(filename);

    let tower = Game.getObjectById(tower_id);
    script.run(tower);
  });
};