import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when an acting host leaves a lobby and a new acting host is selected.
 */
export class LobbyHostMigratedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param oldHost - The connection that is no longer an acting host
   * @param newHost - The connection that is now an acting host
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly oldHost: Connection,
    protected newHost: Connection,
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
  getOldHost(): Connection {
    return this.oldHost;
  }

  /**
   * Gets the connection that is now an acting host.
   */
  getNewHost(): Connection {
    return this.newHost;
  }

  /**
   * Sets the connection that is now an acting host.
   *
   * @param host - The new connection that is now an acting host
   */
  setNewHost(host: Connection): this {
    this.newHost = host;

    return this;
  }
}
