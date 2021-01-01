import { LobbyInstance } from "../../lobby";

/**
 * Fired when a lobby has been destroyed.
 */
export class ServerLobbyDestroyedEvent {
  constructor(
    public readonly lobby: LobbyInstance,
  ) {}
}
