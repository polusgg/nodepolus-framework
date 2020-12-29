import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";

export class LobbyRemovedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
  ) {
    super();
  }
}
