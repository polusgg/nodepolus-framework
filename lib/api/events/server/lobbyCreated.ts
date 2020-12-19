import { CancellableEvent } from "../cancellableEvent";
import { Lobby } from "../../../lobby";

export class LobbyCreatedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: Lobby,
  ) {
    super();
  }
}
