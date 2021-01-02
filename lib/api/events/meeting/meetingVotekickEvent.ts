import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has cast a vote to kick another player.
 */
export class MeetingVotekickEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public player: PlayerInstance,
    public target: PlayerInstance,
  ) {
    super();
  }
}
