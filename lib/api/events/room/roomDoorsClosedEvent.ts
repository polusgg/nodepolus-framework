import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when the doors of a room have closed.
 */
export class RoomDoorsClosedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param doors - The doors that were closed
   * @param player - The player that closed the doors
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
   * Gets the doors that were closed.
   */
  getDoors(): number[] {
    return this.doors;
  }

  /**
   * Sets the doors that were closed.
   *
   * @param doors - The new doors that were closed
   */
  setDoors(doors: number[]): void {
    this.doors = doors;
  }

  /**
   * Gets the player that closed the doors.
   *
   * @returns The player that closed the doors, or `undefined` if they were closed via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
