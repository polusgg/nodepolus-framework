import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";

/**
 * Fired when a connection to the server has been closed, either by the connection or forcibly by the server.
 */
export class ConnectionClosedEvent {
  constructor(
    public readonly connection: Connection,
    public readonly reason: DisconnectReason = DisconnectReason.serverRequest(),
  ) {}
}
