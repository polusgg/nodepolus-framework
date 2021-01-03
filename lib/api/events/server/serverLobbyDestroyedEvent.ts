import { LobbyInstance } from "../../lobby";

/**
 * Fired when a lobby has been destroyed.
 */
export class ServerLobbyDestroyedEvent {
  constructor(
    private readonly lobby: LobbyInstance,
  ) {}

  getLobby(): LobbyInstance {
    return this.lobby;
  }
}
