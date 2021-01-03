import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has had one of their tasks updated to an incomplete state.
 */
export class PlayerTaskUncompletedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly task: Task,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTask(): Task {
    return this.task;
  }
}
