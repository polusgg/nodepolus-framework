import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting has begun.
 */
export class MeetingStartedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public caller: PlayerInstance,
    public victim?: PlayerInstance,
  ) {
    super();
  }
}
