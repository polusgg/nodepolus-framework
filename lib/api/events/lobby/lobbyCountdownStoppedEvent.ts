import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "..";

/**
 * Fired when the start-game countdown has stopped.
 */
export class LobbyCountdownStoppedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public readonly starter: PlayerInstance,
    public readonly secondsLeft: number,
    public readonly wasInterrupted: boolean,
  ) {
    super();
  }
}
