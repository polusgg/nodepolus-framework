import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has been assigned one or more new tasks.
 */
export class PlayerTaskAddedEvent extends CancellableEvent {
  /**
   * @param player The player whose task list was updated
   * @param tasks The player's task list
   */
  constructor(
    private readonly player: PlayerInstance,
    private tasks: Set<LevelTask>,
  ) {
    super();
  }

  /**
   * Gets the player whose task list was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's task list.
   */
  getTasks(): Set<LevelTask> {
    return this.tasks;
  }

  /**
   * Sets the player's task list.
   *
   * @param tasks The player's new task list
   */
  setTasks(tasks: Set<LevelTask>): void {
    this.tasks = tasks;
  }
}
