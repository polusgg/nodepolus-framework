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
    public readonly game: Game,
    public readonly starter: PlayerInstance,
    public roles: Map<PlayerRole, PlayerInstance[]>,
  ) {
    super();
  }
}
