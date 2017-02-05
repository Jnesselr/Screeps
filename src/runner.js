let context = require.context('./roles/', true, /\.js$/);

module.exports = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    let script = context(creep.memory.script);

    script.run(creep);
  }
};