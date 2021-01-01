import { Connection } from "../../../protocol/connection";
import { CancellableEvent } from "..";

/**
 * Fired when a connection to the server has been initialized with a Hello packet.
 */
export class ConnectionOpenedEvent extends CancellableEvent {
  constructor(
    public readonly connection: Connection,
  ) {
    super();
  }
}
