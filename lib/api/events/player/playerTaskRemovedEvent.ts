import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has had one or more of their tasks removed.
 */
export class PlayerTaskRemovedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly tasks: Set<LevelTask>,
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
