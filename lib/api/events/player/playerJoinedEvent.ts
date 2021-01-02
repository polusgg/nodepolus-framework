import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has joined a lobby.
 */
export class PlayerJoinedEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly player: PlayerInstance,
    public readonly isRejoining: boolean = false,
  ) {}
}
