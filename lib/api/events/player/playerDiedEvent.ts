import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player has died, either by being exiled or by being murdered.
 */
export class PlayerDiedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
