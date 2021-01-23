import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a switch has been flipped during an electrical sabotage.
 */
export class RoomElectricalInteractedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param index The switch that was flipped
   * @param flipped Whether or not the switch is flipped up
   * @param player The player that flipped the switch
   */
  constructor(
    private readonly game: Game,
    private readonly index: number,
    private flipped: boolean,
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
   * Gets the switch that was flipped.
   */
  getIndex(): number {
    return this.index;
  }

  /**
   * Gets whether or not the switch is flipped up.
   *
   * @returns `true` if flipped up, `false` if down
   */
  isFlipped(): boolean {
    return this.flipped;
  }

  /**
   * Sets whether or not the switch is flipped up.
   *
   * @param flipped `true` for flipped up, `false` for down
   */
  setFlipped(flipped: boolean): void {
    this.flipped = flipped;
  }

  /**
   * Gets the player that flipped the switch.
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
