import { BaseGameRoom } from "../../game/room";
import { CancellableEvent } from "../types";

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
