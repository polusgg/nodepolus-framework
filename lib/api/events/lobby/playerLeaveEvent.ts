import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerLeaveEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
