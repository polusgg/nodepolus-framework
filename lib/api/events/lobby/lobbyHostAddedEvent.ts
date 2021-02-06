import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the acting host status is added to a connection in a lobby.
 */
export class LobbyHostAddedEvent extends CancellableEvent {
  /**
   * @param lobby The lobby from which this event was fired
   * @param host The connection that is now an acting host
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly host: Connection,
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
   * Gets the connection that is now an acting host.
   */
  getHost(): Connection {
    return this.host;
  }
}
