import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerVotedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly votedFor?: PlayerInstance,
  ) {
    super();
  }
}
