import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "..";

/**
 * Fired when a connection is attempting to get a list of public lobbies.
 */
export class ServerLobbyListEvent extends CancellableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobbies: LobbyListing[],
    public readonly lobbyCounts: LobbyCount,
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
