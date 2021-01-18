import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a communications console has been repaired.
 */
export class RoomCommunicationsConsoleRepairedEvent extends CancellableEvent {
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
   * Gets the communications console that was repaired.
   */
  getConsole(): number {
    return this.console;
  }
}
