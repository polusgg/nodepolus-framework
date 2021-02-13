import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelVent } from "../../../types";
import { Game } from "../../game";

/**
 * Fired when a player has exited a vent.
 */
export class GameVentExitedEvent extends CancellableEvent {
  /**
   * @param gam - The game from which this event was fired
   * @param playe - The player that exited the vent
   * @param ven - The vent that the player exited
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
   * Gets the player that exited the vent.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the vent that the player exited.
   */
  getVent(): LevelVent {
    return this.vent;
  }
}
