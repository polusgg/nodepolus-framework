import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the start-game countdown has stopped.
 */
export class LobbyCountdownStoppedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly starter: PlayerInstance,
    private readonly secondsLeft: number,
    private readonly interrupted: boolean,
  ) {
    super();
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getStarter(): PlayerInstance {
    return this.starter;
  }

  getSecondsLeft(): number {
    return this.secondsLeft;
  }

  wasInterrupted(): boolean {
    return this.interrupted;
  }
}
