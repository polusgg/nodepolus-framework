import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when an oxygen console has been reset to a sabotaged state.
 */
export class RoomOxygenConsoleClearedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param console The oxygen console that was reset
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
   * Gets the oxygen console that was reset.
   */
  getConsole(): number {
    return this.console;
  }
}
