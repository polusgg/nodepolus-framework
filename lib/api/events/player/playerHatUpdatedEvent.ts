import { PlayerHat } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's hat has been updated.
 */
export class PlayerHatUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldHat: PlayerHat,
    public newHat: PlayerHat,
  ) {
    super();
  }
}
