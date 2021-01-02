import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player's vote to kick another player has been rescinded.
 */
export class PlayerVotekickRemovedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
    public readonly target: PlayerInstance,
  ) {
    super();
  }
}
