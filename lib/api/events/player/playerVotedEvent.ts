import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerVotedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly votedFor?: Player,
  ) {
    super();
  }
}
