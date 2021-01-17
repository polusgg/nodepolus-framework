import { BaseGameRoom } from "../../game/room";
import { CancellableEvent } from "../types";

/**
 * Fired when a room has been sabotaged.
 */
export class RoomSabotagedEvent extends CancellableEvent {
  constructor(
    private readonly room: BaseGameRoom,
  ) {
    super();
  }

  getRoom(): BaseGameRoom {
    return this.room;
  }
}
