/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.resource_fetch');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    fetch_closest_dropped_energy: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            var flag = Game.flags['StagingArea'];
            if(creep.fatigue == 0)
                creep.moveTo(flag);
        }
        
        // TODO Grab energy from container if it's closer
    }
};