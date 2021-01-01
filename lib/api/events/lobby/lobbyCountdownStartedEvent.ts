import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "..";

/**
 * Fired when the start-game countdown has begun.
 */
export class LobbyCountdownStartedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly starter: PlayerInstance,
    public secondsLeft: number,
  ) {
    super();
  }
}
