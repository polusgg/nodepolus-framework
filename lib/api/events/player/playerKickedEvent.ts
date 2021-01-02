import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been kicked from a lobby.
 */
export class PlayerKickedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
