import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has had one or more of their tasks removed.
 */
export class PlayerTaskRemovedEvent extends CancellableEvent {
  /**
   * @param player - The player whose task list was updated
   * @param tasks - The player's task list
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly tasks: Set<LevelTask>,
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
}
