import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has left a lobby.
 */
export class PlayerLeftEvent {
  /**
   * @param lobby - The lobby that the player left
   * @param player - The player that left
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly player: PlayerInstance,
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
