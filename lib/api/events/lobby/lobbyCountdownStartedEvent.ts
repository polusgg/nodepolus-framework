import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the start-game countdown has begun.
 */
export class LobbyCountdownStartedEvent extends CancellableEvent {
  /**
   * @param lobby The lobby from which this event was fired
   * @param secondsUntilStart The number of seconds until the game will start
   * @param starter The player that clicked the Start Game button
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private secondsUntilStart: number,
    private readonly starter?: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the lobby from which this event was fired.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the number of seconds until the game will start.
   */
  getSecondsUntilStart(): number {
    return this.secondsUntilStart;
  }

  /**
   * Sets the time in seconds until the game will start.
   *
   * @param secondsUntilStart The new time in seconds until the game will start
   */
  setSecondsUntilStart(secondsUntilStart: number): void {
    this.secondsUntilStart = secondsUntilStart;
  }

  /**
   * Gets the player that clicked the Start Game button.
   *
   * @returns The player that is starting the game, or `undefined` if the game is being started via the API
   */
  getStarter(): PlayerInstance | undefined {
    return this.starter;
  }
}
