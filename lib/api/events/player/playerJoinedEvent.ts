import { InternalLobby } from "../../../lobby";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player has joined a lobby.
 */
export class PlayerJoinedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
