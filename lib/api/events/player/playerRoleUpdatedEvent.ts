import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player's role has been changed to either crewmate or impostor.
 */
export class PlayerRoleUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
