import { PlayerRole } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's role has been changed to either crewmate or impostor.
 */
export class PlayerRoleUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private newRole: PlayerRole,
    private readonly oldRole?: PlayerRole,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldRole(): PlayerRole | undefined {
    return this.oldRole;
  }

  getNewRole(): PlayerRole {
    return this.newRole;
  }

  setNetRole(newRole: PlayerRole): void {
    this.newRole = newRole;
  }
}
