import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting window has been closed.
 */
export class MeetingClosedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    // TODO
    public readonly votes: [],
  ) {
    super();
  }

  isTie(): boolean {
    // TODO
    return false;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    // TODO
    return undefined;
  }
}
