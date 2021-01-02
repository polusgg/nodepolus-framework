import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";

/**
 * Fired when a connection is attempting to get a list of public lobbies.
 */
export class ServerLobbyListEvent extends DisconnectableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly requestedPrivate: boolean,
    public lobbies: LobbyListing[],
    public lobbyCounts: LobbyCount,
  ) {
    super(DisconnectReason.custom("The server refused to list its public games"));
  }
}
