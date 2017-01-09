
module.exports = {
    key: 'basic_harvester',
    needed: 0,
    body: [WORK, WORK, MOVE],
    memory: function() {
        // Somehow, we need what source we're going after
        return {}
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        switch (creep.memory.state) {
            case 'Init':
                // We were just spawned, so we need to try to get close to the source spot we're assigned to
                break;
            case 'Harvesting':
                // Harvest everything we can
        }
        let r = creep.room;

        let sources = r.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            if(creep.fatigue == 0)
                creep.moveTo(sources[0]);
        }
	}
};