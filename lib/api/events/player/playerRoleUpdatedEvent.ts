import { PlayerRole } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's role has been changed to either crewmate or impostor.
 */
export class PlayerRoleUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldRole: PlayerRole,
    private newRole: PlayerRole,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldRole(): PlayerRole {
    return this.oldRole;
  }

  getNewRole(): PlayerRole {
    return this.newRole;
  }

  setNetRole(newRole: PlayerRole): void {
    this.newRole = newRole;
  }
}
