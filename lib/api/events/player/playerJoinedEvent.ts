import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a player has joined a lobby.
 */
export class PlayerJoinedEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly player: PlayerInstance,
    private readonly rejoining: boolean = false,
  ) {}

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  isRejoining(): boolean {
    return this.rejoining;
  }
}
