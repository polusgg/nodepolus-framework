import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerVotedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly votedFor?: PlayerInstance,
  ) {
    super();
  }
}
