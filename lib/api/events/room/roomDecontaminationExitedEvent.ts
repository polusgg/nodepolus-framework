import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a decontamination room's door has opened to let players exit.
 */
export class RoomDecontaminationExitedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param decontamination The decontamination room that was exited
   * @param side The side that the player exited through
   */
  constructor(
    private readonly game: Game,
    private readonly decontamination: number,
    private readonly side: number,
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
   * Gets the decontamination room that was exited.
   */
  getDecontamination(): number {
    return this.decontamination;
  }

  /**
   * Gets the side that the player exited through.
   */
  getSide(): number {
    return this.side;
  }
}
