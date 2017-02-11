let run_script = function (script, event_type, thing) {
  let event_context = context.task();
  let task = event_context(script);

  task.run(event_type, thing);
};

let manager = {
  run: function () {
    if (Game.time in Memory.event.tasksOnTick) {
      console.log(`${Game.time} found in tasks on tick`);
      let tasks = Memory.event.tasksOnTick[Game.time];

      while(tasks.length > 0) {
        let task = tasks[0];
        let script;

        if(task.name != null) {
          script = Memory.event.name_source_map[task.name];
        } else {
          console.log(`Pulling script directly for ${JSON.stringify(task)}`);
          script = task.script;
        }

        console.log(`Running ${script}`);


        run_script(script, events.GAME_TICK, task.object);

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
  }
};

module.exports = manager;