import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby has been destroyed.
 */
export class ServerLobbyDestroyedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
  ) {
    super();
  }

  /**
   * Gets the lobby that will be destroyed.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }
}
