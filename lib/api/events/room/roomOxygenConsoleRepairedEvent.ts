import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when an oxygen console has been repaired.
 */
export class RoomOxygenConsoleRepairedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly console: number,
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
