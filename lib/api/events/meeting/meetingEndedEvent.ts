import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  constructor(
    public game: Game,
    public isTie: boolean,
    public exiled?: PlayerInstance,
    // TODO: Include final vote states
  ) {}
}
