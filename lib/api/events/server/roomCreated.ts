import { CancellableEvent } from "../cancellableEvent";
import { Room } from "../../../room";

export class RoomCreatedEvent extends CancellableEvent {
  constructor(public readonly room: Room) {
    super();
  }
}
