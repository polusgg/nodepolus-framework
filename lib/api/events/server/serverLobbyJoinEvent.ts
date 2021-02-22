import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a connection is attempting to join a lobby.
 */
export class ServerLobbyJoinEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that is joining the lobby
   * @param lobbyCode - The lobby code provided by the connection
   * @param lobby - The lobby that is being joined
   */
  constructor(
    protected readonly connection: Connection,
    protected readonly lobbyCode: string,
    protected lobby?: LobbyInstance,
  ) {
    super(DisconnectReason.custom("The server refused to let you join that game"));
  }

  /**
   * Gets the connection that is joining the lobby.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the lobby code provided by the connection.
   */
  getLobbyCode(): string {
    return this.lobbyCode;
  }

  /**
   * Gets the lobby that is being joined.
   *
   * @returns The lobby, or `undefined` if no lobby with the given code was found
   */
  getLobby(): LobbyInstance | undefined {
    return this.lobby;
  }

  /**
   * Sets the lobby that is being joined.
   *
   * @param lobby - The new lobby that is being joined, or `undefined` to act as if the lobby was not found
   */
  setLobby(lobby?: LobbyInstance): void {
    this.lobby = lobby;
  }
}
