import { Connection } from "../../../protocol/connection";
import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";

export class LobbyJoinRequestEvent extends CancellableEvent {
  constructor(
    public readonly connection: Connection,
    public readonly lobbyCode: string,
    public lobby?: InternalLobby,
  ) {
    super();
  }
}
