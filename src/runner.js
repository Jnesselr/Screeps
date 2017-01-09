module.exports = function (creep_templates) {
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let creep_type = creep.memory.creep_type;

        let role = creep_templates[creep_type];

        role.run(creep);
    }
};