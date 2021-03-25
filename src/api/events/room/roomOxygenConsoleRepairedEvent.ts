import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when an oxygen console has been repaired.
 */
export class RoomOxygenConsoleRepairedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param console - The console that was repaired
   * @param player - The player that repaired the oxygen console
   */
  constructor(
    protected readonly game: Game,
    protected readonly console: number,
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
   * Gets the console that was repaired.
   */
  getConsole(): number {
    return this.console;
  }

  /**
   * Gets the player that repaired the oxygen console.
   *
   * @returns The player that repaired the oxygen console, or `undefined` if it was repaired via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
