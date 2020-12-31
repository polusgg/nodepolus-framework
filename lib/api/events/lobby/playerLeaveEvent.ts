import { InternalLobby } from "../../../lobby";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerLeaveEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
