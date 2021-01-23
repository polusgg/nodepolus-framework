import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a communications console has been reset to a sabotaged state.
 */
export class RoomCommunicationsConsoleClearedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param console The communications console that was reset
   */
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
