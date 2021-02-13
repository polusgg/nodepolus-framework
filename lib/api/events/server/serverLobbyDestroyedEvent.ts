import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby has been destroyed.
 */
export class ServerLobbyDestroyedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby that will be destroyed
   */
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
