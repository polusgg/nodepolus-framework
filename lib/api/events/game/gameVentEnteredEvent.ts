import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelVent } from "../../../types";
import { Game } from "../../game";

/**
 * Fired when a player has entered a vent.
 */
export class GameVentEnteredEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that entered the vent
   * @param vent - The vent that the player entered
   */
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly vent: LevelVent,
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
   * Gets the player that entered the vent.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the vent that the player entered.
   */
  getVent(): LevelVent {
    return this.vent;
  }
}
