import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a communications console has been repaired.
 */
export class RoomCommunicationsConsoleRepairedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param console - The communications console that was repaired
   * @param player - The player that repaired the communications console
   */
  constructor(
    protected readonly game: Game,
    protected readonly player?: PlayerInstance,
    protected readonly console?: number,
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
  getConsole(): number | undefined {
    return this.console;
  }

  /**
   * Gets the player that repaired the communications console.
   *
   * @returns The player that repaired the communications console, or `undefined` if it was repaired via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
