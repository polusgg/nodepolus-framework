import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has left a lobby.
 */
export class PlayerLeftEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly player: PlayerInstance,
  ) {}

  /**
   * Gets the lobby that the player left.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the player that left.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
