import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has left a lobby.
 */
export class PlayerLeftEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly player: PlayerInstance,
  ) {}
}
