import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerJoinEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
