import { CancellableEvent } from "../types";
import { Game } from "../../game";
import { PlayerInstance } from "../../player";

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
    protected readonly clearer?: PlayerInstance,
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

  /**
   * Gets the player that cleared the reactor console.
   *
   * @returns The player that cleared the reactor console, or `undefined` if it was repaired via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.clearer;
  }
}
