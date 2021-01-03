import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has had one or more of their tasks removed.
 */
export class PlayerTaskRemovedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly tasks: Task[],
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTasks(): Task[] {
    return this.tasks;
  }
}
