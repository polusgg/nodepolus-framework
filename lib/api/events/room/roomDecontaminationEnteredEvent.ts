import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a decontamination room's door has opened to let players enter.
 */
export class RoomDecontaminationEnteredEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly decontamination: number,
    private readonly side: number,
    private readonly player?: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the decontamination room that was entered.
   */
  getDecontamination(): number {
    return this.decontamination;
  }

  /**
   * Gets the side that the player entered from.
   */
  getSide(): number {
    return this.side;
  }

  /**
   * Gets the player that opened the decontamination room.
   *
   * @returns The player that opened the decontamination room, or `undefined` if it was opened via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
