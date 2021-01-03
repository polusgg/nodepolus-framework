import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has completed one of their tasks.
 */
export class PlayerTaskCompletedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private task: Task,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTask(): Task {
    return this.task;
  }

  setTask(task: Task): void {
    this.task = task;
  }
}
