import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when the start-game countdown has begun.
 */
export class LobbyCountdownStartedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private secondsUntilStart: number,
    private readonly starter?: PlayerInstance,
  ) {
    super();
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getStarter(): PlayerInstance | undefined {
    return this.starter;
  }

  getSecondsUntilStart(): number {
    return this.secondsUntilStart;
  }

  setSecondsUntilStart(secondsUntilStart: number): void {
    this.secondsUntilStart = secondsUntilStart;
  }
}
