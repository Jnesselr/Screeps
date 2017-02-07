module.exports = {
  name: 'reset safe mode',
  when: [
    events.NEW_ROOM,
    events.CONTROLLER_UPGRADE
  ],
  run: function (event_type, object) {
    let controller;

    if (event_type == events.NEW_ROOM) {
      /** @type {Room} room */
      let room = Game.rooms[object.room];
      /** @type {StructureController} controller */
      controller = room.controller;
    } else if (event_type == events.CONTROLLER_UPGRADE) {
      controller = Game.getObjectById(object.id);
    }

    if (controller.safeMode == null && controller.safeModeAvailable > 0) {
      let result = controller.activateSafeMode();

      if (result == ERR_TIRED) {
        let gameTickToCheck = controller.safeModeCooldown + Game.time;

        on.game_tick(gameTickToCheck, this.name, object);
        console.log(`Controller is in cooldown, checking again: ${gameTickToCheck}`)
      }
    } else {
      let gameTickToCheck = controller.safeMode + Game.time;

      on.game_tick(gameTickToCheck, this.name, object);
      console.log(`Controller safe mode is active, checking again: ${gameTickToCheck}`)
    }
  }
};