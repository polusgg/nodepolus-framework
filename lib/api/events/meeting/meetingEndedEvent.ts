import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  constructor(
    public readonly game: Game,
    // TODO
    public readonly votes: [],
  ) {}

  isTie(): boolean {
    // TODO
    return false;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    // TODO
    return undefined;
  }
}
