import { CancellableEvent } from "../cancellableEvent";
import { Room } from "../../../lobby";

export class RoomCreatedEvent extends CancellableEvent {
  constructor(
    public readonly room: Room,
  ) {
    super();
  }
}
