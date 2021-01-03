import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a connection is attempting to join a lobby.
 */
export class ServerLobbyJoinEvent extends DisconnectableEvent {
  constructor(
    private readonly connection: Connection,
    private readonly lobbyCode: string,
    private lobby?: LobbyInstance,
  ) {
    super(DisconnectReason.custom("The server refused to let you join that game"));
  }

  getConnection(): Connection {
    return this.connection;
  }

  getLobbyCode(): string {
    return this.lobbyCode;
  }

  getLobby(): LobbyInstance | undefined {
    return this.lobby;
  }

  setLobby(lobby?: LobbyInstance): void {
    this.lobby = lobby;
  }
}
