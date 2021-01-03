import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player's vote has been rescinded in a meeting.
 */
export class MeetingVoteRemovedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private player: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  setPlayer(player: PlayerInstance): void {
    this.player = player;
  }
}
