import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a decontamination room has fired its sprayers to decontaminate all players inside.
 */
export class RoomDecontaminationSprayedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param decontamination The decontamination room that activated its sprayers
   */
  constructor(
    private readonly game: Game,
    private readonly decontamination: number,
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
   * Gets the decontamination room that activated its sprayers.
   */
  getDecontamination(): number {
    return this.decontamination;
  }
}
