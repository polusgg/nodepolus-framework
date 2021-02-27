import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when the doors of a room have opened.
 */
export class RoomDoorsOpenedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param doors - The doors that were opened
   * @param player - The player that opened the doors
   */
  constructor(
    protected readonly game: Game,
    protected doors: number[],
    protected readonly player?: PlayerInstance,
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
   * Gets the doors that were opened.
   */
  getDoors(): number[] {
    return this.doors;
  }

  /**
   * Sets the doors that were opened.
   *
   * @param doors - The new doors that were opened
   */
  setDoors(doors: number[]): this {
    this.doors = doors;

    return this;
  }

  /**
   * Gets the player that opened the doors.
   *
   * @returns The player that opened the doors, or `undefined` if they were opened via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
