import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's host has been changed.
 *
 * TODO: document this better
 */
export class LobbyHostUpdatedEvent extends CancellableEvent {
  /**
   * @param lobby The lobby from which this event was fired
   * @param host The host of the lobby
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private host: Connection,
  ) {
    super();
  }

  /**
   * Gets the lobby from which this event was fired.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the host of the lobby.
   */
  getHost(): Connection {
    return this.host;
  }

  /**
   * Sets the host of the lobby.
   *
   * @param host The host to set for the lobby
   */
  setHost(host: Connection): void {
    this.host = host;
  }
}
