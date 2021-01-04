import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has been assigned one or more new tasks.
 */
export class PlayerTaskAddedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private tasks: Set<LevelTask>,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTasks(): Set<LevelTask> {
    return this.tasks;
  }

  setTasks(tasks: Set<LevelTask>): void {
    this.tasks = tasks;
  }
}
