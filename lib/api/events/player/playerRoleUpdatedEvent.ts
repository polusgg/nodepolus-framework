import { PlayerRole } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's role has been changed to either Crewmate or Impostor.
 */
export class PlayerRoleUpdatedEvent extends CancellableEvent {
  /**
   * @param player The player whose role was updatd
   * @param newRole The player's old role
   * @param oldRole The player's new role
   */
  constructor(
    private readonly player: PlayerInstance,
    private newRole: PlayerRole,
    private readonly oldRole?: PlayerRole,
  ) {
    super();
  }

  /**
   * Gets the player whose role was updatd.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old role.
   *
   * @returns The player's old role, or `undefined` if they are being assigned a role at the start of a game
   */
  getOldRole(): PlayerRole | undefined {
    return this.oldRole;
  }

  /**
   * Gets the player's new role.
   */
  getNewRole(): PlayerRole {
    return this.newRole;
  }

  /**
   * Sets the player's new role.
   *
   * @param newRole The player's new role
   */
  setNetRole(newRole: PlayerRole): void {
    this.newRole = newRole;
  }
}
