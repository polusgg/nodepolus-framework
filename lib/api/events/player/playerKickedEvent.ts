import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been kicked from a lobby.
 */
export class PlayerKickedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly player: PlayerInstance,
    private readonly kickingPlayer?: PlayerInstance,
  ) {
    super();
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getKickingPlayer(): PlayerInstance | undefined {
    return this.kickingPlayer;
  }
}
