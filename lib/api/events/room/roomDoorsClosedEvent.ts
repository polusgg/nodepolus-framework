import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Door, Game } from "../../game";

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
    private readonly game: Game,
    private doors: Door[],
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
   * Gets the doors that were closed.
   */
  getDoors(): Door[] {
    return this.doors;
  }

  /**
   * Sets the doors that were closed.
   *
   * @param doors - The new doors that were closed
   */
  setDoors(doors: Door[]): void {
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
