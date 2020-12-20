import { CancellableEvent } from "..";
import { Player } from "../../player";

export class VotedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly votedFor?: Player,
  ) {
    super();
  }
}
