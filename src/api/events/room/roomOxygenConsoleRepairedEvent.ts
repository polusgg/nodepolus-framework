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
}
