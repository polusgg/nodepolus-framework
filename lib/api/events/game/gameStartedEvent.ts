import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a game has started.
 */
export class GameStartedEvent {
  /**
   * @param game The game that started
   * @param impostors The players that were chosen to be an Impostor
   */
  constructor(
    private readonly game: Game,
    private impostors: PlayerInstance[],
  ) {}

  /**
   * Gets the game that started.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the players that were chosen to be an Impostor.
   */
  getImpostors(): PlayerInstance[] {
    return this.impostors;
  }

  /**
   * Sets the players that will be assigned Impostor.
   *
   * @param impostors The new players that will be assigned Impostor
   */
  setImpostors(impostors: PlayerInstance[]): void {
    this.impostors = impostors;
  }
}
