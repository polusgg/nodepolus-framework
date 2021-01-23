import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a reactor console has been repaired.
 */
export class RoomReactorConsoleRepairedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param console The console that was repaired
   * @param player The player that repaired the reactor console
   */
  constructor(
    private readonly game: Game,
    private readonly console: number,
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
   * Gets the console that was repaired.
   */
  getConsole(): number {
    return this.console;
  }

  /**
   * Gets the player that repaired the reactor console.
   *
   * @returns The player that repaired the reactor console, or `undefined` if it was repaired via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
