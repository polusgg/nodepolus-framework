import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been killed by another player.
 */
export class PlayerMurderedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly killer: PlayerInstance,
  ) {
    super();
  }
}
