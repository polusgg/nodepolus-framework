import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a connection is attempting to join a lobby.
 */
export class ServerLobbyJoinEvent extends DisconnectableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobbyCode: string,
    public lobby?: LobbyInstance,
  ) {
    super(DisconnectReason.custom("The server refused to let you join that game"));
  }
}
