import { CancellableEvent } from "..";
import { Connection } from "../../../protocol/connection";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a new lobby has been created.
 */
export class ServerLobbyCreatedEvent extends CancellableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobby: LobbyInstance,
  ) {
    super();
  }
}
