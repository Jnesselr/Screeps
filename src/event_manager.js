let run_script = function (script, thing) {
  let task = manager.task_context(script);
  task.run(thing);
};

let manager = {
  run: function () {
    if (Memory.event.events == null || Memory.event.events.length == 0)
      return false;

    if (Game.time in Memory.event.tasksOnTick) {
      let tasks = Memory.event.tasksOnTick[Game.time];

      while(tasks.length > 0) {
        let task = tasks[0];

        console.log(`Running ${task.script}`);
        run_script(script, task.object);

        tasks.shift();
      }

      return true;
    }

    let event = Memory.event.events[0];
    let object = event.object;

    while (event.scripts.length > 0) {
      let script = event.scripts[0];

      console.log(`Running ${script}`);
      run_script(script, object);

      event.scripts.shift();
    }

    Memory.event.events.shift();

    return true
  },
  task_context: require.context('./tasks/', true, /\.js$/)
};

module.exports = manager;