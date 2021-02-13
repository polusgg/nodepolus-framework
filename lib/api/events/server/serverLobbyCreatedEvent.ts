import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a new lobby has been created.
 */
export class ServerLobbyCreatedEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that created the lobby
   * @param lobby - The newly created lobby
   */
  constructor(
    private readonly connection: Connection,
    private readonly lobby: LobbyInstance,
  ) {
    super(DisconnectReason.custom("The server refused to create your game"));
  }

  /**
   * Gets the connection that created the lobby.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the newly created lobby.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }
}
