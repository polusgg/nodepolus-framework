import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";

/**
 * Fired when a connection is attempting to get a list of public lobbies.
 */
export class ServerLobbyListEvent extends DisconnectableEvent {
  constructor(
    private readonly connection: Connection,
    private readonly includePrivateLobbies: boolean,
    private lobbies: LobbyListing[],
    private lobbyCounts: LobbyCount,
  ) {
    super(DisconnectReason.custom("The server refused to list its public games"));
  }

  getConnection(): Connection {
    return this.connection;
  }

  wantsPrivateLobbies(): boolean {
    return this.includePrivateLobbies;
  }

  getLobbies(): LobbyListing[] {
    return this.lobbies;
  }

  setLobbies(lobbies: LobbyListing[]): void {
    this.lobbies = lobbies;
  }

  getLobbyCounts(): LobbyCount {
    return this.lobbyCounts;
  }

  setLobbyCounts(lobbyCounts: LobbyCount): void {
    this.lobbyCounts = lobbyCounts;
  }
}
