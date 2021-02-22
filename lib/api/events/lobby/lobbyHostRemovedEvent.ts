import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the acting host status is removed from a connection in a lobby.
 */
export class LobbyHostRemovedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param host - The connection that is no longer an acting host
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly host: Connection,
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
   * Gets the connection that is no longer an acting host.
   */
  getHost(): Connection {
    return this.host;
  }
}
