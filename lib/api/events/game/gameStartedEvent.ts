import { PlayerRole } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a game has started.
 *
 * TODO: Add note about adding a player to more than one role
 */
export class GameStartedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly starter: PlayerInstance,
    private roles: Map<PlayerRole, PlayerInstance[]>,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getStarter(): PlayerInstance {
    return this.starter;
  }

  getRoles(): Map<PlayerRole, PlayerInstance[]> {
    return this.roles;
  }

  setRoles(roles: Map<PlayerRole, PlayerInstance[]>): void {
    this.roles = roles;
  }
}
