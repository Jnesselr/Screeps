let run_script = function (script, event_type, thing) {
  let task = manager.task_context(script);
  task.run(event_type, thing);
};

let manager = {
  run: function () {
    if (Game.time in Memory.event.tasksOnTick) {
      console.log(`${Game.time} found in tasks on tick`);
      let tasks = Memory.event.tasksOnTick[Game.time];

      while(tasks.length > 0) {
        let task = tasks[0];

        console.log(`Running ${task.script}`);
        run_script(task.script, events.GAME_TICK, task.object);

        tasks.shift();
      }

      delete Memory.event.tasksOnTick[Game.time];

      return true;
    }

    if (Memory.event.events == null || Memory.event.events.length == 0)
      return false;

    let event = Memory.event.events[0];
    let object = event.object;

    while (event.scripts.length > 0) {
      let script = event.scripts[0];

      console.log(`Running ${script}`);
      run_script(script, event.type, object);

      event.scripts.shift();
    }

    Memory.event.events.shift();

    return true
  },
  task_context: require.context('./tasks/', true, /\.js$/)
};

module.exports = manager;