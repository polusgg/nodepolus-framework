import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been banned from a lobby.
 */
export class PlayerBannedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly player: PlayerInstance,
    public readonly bannedBy: PlayerInstance,
  ) {
    super();
  }
}
