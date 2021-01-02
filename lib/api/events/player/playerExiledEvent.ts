import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been exiled at the end of a meeting.
 */
export class PlayerExiledEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly voters: PlayerInstance[],
  ) {
    super();
  }
}
