import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a communications console has been closed by a player.
 */
export class RoomCommunicationsConsoleClosedEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that closed the communications console
   * @param console - The communications console that was closed
   */
  constructor(
    protected readonly game: Game,
    protected readonly player: PlayerInstance,
    protected readonly console: number,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that closed the communications console.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the communications console that was closed.
   */
  getConsole(): number {
    return this.console;
  }
}
