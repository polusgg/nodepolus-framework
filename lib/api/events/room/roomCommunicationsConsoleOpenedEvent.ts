import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a communications console has been opened by a player.
 */
export class RoomCommunicationsConsoleOpenedEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly console: number,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that opened the communications panel.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the communications console that was opened.
   */
  getConsole(): number {
    return this.console;
  }
}
