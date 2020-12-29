import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";

export class LobbyCreatedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
  ) {
    super();
  }
}
