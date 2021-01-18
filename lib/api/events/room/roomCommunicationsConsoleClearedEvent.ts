import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a communications console has been reset.
 */
export class RoomCommunicationsConsoleClearedEvent extends CancellableEvent {
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
   * Gets the communications console that was reset.
   */
  getConsole(): number {
    return this.console;
  }
}
