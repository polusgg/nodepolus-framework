import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the start-game countdown has stopped.
 */
export class LobbyCountdownStoppedEvent extends CancellableEvent {
  /**
   * @param lobby The lobby from which this event was fired
   * @param secondsLeft The number of seconds remaining until the game would have started
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly secondsLeft: number,
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
   * Gets the number of seconds remaining until the game would have started.
   */
  getSecondsLeft(): number {
    return this.secondsLeft;
  }
}
