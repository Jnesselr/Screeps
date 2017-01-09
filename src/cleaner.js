module.exports = function() {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing ${name} from memory`);
        }
    }
};