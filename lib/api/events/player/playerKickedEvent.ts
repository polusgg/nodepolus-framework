import { DisconnectReason } from "../../../types";
import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been kicked from a lobby.
 */
export class PlayerKickedEvent extends CancellableEvent {
  /**
   * @param lobby The lobby that the player was kicked from
   * @param player The player that was kicked
   * @param kickingPlayer The player that kicked the player
   * @param reason The disconnect reason to be sent to the player
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly player: PlayerInstance,
    private readonly kickingPlayer?: PlayerInstance,
    private readonly reason?: DisconnectReason,
  ) {
    super();
  }

  /**
   * Gets the lobby that the player was kicked from.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the player that was kicked.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player that kicked the player.
   */
  getKickingPlayer(): PlayerInstance | undefined {
    return this.kickingPlayer;
  }

  /**
   * Gets the disconnect reason to be sent to the player.
   */
  getReason(): DisconnectReason | undefined {
    return this.reason;
  }
}
