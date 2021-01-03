import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has been assigned one or more new tasks.
 */
export class PlayerTaskAddedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private tasks: Task[],
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }
}
