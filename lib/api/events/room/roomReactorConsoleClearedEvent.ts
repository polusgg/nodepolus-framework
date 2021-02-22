import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a reactor console has been reset to a sabotaged state.
 */
export class RoomReactorConsoleClearedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param console - The reactor console that was reset
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
   * Gets the reactor console that was reset.
   */
  getConsole(): number {
    return this.console;
  }
}
