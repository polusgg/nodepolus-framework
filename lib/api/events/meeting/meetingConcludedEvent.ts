import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when the voting phase of a meeting has finished.
 */
export class MeetingConcludedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    // TODO
    public votes: [],
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
