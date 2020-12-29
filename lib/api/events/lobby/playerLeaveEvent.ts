import { InternalLobby } from "../../../lobby";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerLeaveEvent extends CancellableEvent {
  constructor(
    public readonly lobby: InternalLobby,
    public readonly player: Player,
  ) {
    super();
  }
}
