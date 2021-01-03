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

  getLobby(): LobbyInstance {
    return this.lobby;
  }
}
