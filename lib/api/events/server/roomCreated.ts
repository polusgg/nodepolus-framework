import { CancellableEvent } from "../cancellableEvent";
import { Lobby } from "../../../lobby";

export class RoomCreatedEvent extends CancellableEvent {
  constructor(
    public readonly room: Lobby,
  ) {
    super();
  }
}
