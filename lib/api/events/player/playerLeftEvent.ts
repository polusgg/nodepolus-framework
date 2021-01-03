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

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }
}
