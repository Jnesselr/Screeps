let role_context = context.role();

module.exports = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    let script = role_context(creep.memory.script);

    script.run(creep);
  }
};