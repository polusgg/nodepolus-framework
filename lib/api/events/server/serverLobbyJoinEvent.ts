import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "..";

/**
 * Fired when a connection is attempting to join a lobby.
 */
export class ServerLobbyJoinEvent extends CancellableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobbyCode: string,
    public lobby?: LobbyInstance,
  ) {
    super();
  }
}
