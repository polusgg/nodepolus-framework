import { BaseGameRoom } from "../../game/room";
import { CancellableEvent } from "../types";

/**
 * Fired when a sabotaged room has been repaired.
 */
export class RoomRepairedEvent extends CancellableEvent {
  constructor(
    private readonly room: BaseGameRoom,
  ) {
    super();
  }

  getRoom(): BaseGameRoom {
    return this.room;
  }
}
