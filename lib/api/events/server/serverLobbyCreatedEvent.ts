import { Connection } from "../../../protocol/connection";
import { DisconnectReason } from "../../../types";
import { DisconnectableEvent } from "../types";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a new lobby has been created.
 */
export class ServerLobbyCreatedEvent extends DisconnectableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobby: LobbyInstance,
  ) {
    super(DisconnectReason.custom("The server refused to create your game"));
  }
}
