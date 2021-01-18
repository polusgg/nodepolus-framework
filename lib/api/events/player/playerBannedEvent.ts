import { DisconnectReason } from "../../../types";
import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been banned from a lobby.
 */
export class PlayerBannedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly player: PlayerInstance,
    private readonly banningPlayer?: PlayerInstance,
    private readonly reason?: DisconnectReason,
  ) {
    super();
  }

  /**
   * Gets the lobby that the player was banned from.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the player that was banned.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player that banned the player.
   */
  getBanningPlayer(): PlayerInstance | undefined {
    return this.banningPlayer;
  }

  /**
   * Gets the disconnect reason to be sent to the player.
   */
  getReason(): DisconnectReason | undefined {
    return this.reason;
  }
}
