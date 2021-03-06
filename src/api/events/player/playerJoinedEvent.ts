import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has joined a lobby.
 */
export class PlayerJoinedEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param player - The player that joined the lobby
   * @param rejoining - `true` if the player is rejoining the game, `false` if not (default `false`)
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly player: PlayerInstance,
    protected readonly rejoining: boolean = false,
  ) {}

  /**
   * Gets the lobby from which this event was fired.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the player that joined the lobby.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets whether or not the player is rejoining the game.
   *
   * @returns `true` if rejoining after the end of a game, `false` if not
   */
  isRejoining(): boolean {
    return this.rejoining;
  }
}
