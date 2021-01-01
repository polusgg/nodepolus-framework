import { PlayerHat } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player's hat has been updated.
 */
export class PlayerHatUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldHat: PlayerHat,
    public readonly newHat: PlayerHat,
  ) {
    super();
  }
}
