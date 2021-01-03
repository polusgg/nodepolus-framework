import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the start-game countdown has stopped.
 */
export class LobbyCountdownStoppedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly secondsLeft: number,
  ) {
    super();
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getSecondsLeft(): number {
    return this.secondsLeft;
  }
}
