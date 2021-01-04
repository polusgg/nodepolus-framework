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

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getBanningPlayer(): PlayerInstance | undefined {
    return this.banningPlayer;
  }

  getReason(): DisconnectReason | undefined {
    return this.reason;
  }
}
