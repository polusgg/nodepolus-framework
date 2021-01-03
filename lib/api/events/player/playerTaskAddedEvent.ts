import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has been assigned one or more new tasks.
 */
export class PlayerTaskAddedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private tasks: LevelTask[],
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTasks(): LevelTask[] {
    return this.tasks;
  }

  setTasks(tasks: LevelTask[]): void {
    this.tasks = tasks;
  }
}
