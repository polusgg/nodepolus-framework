import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has had one of their tasks updated to an incomplete state.
 */
export class PlayerTaskUncompletedEvent extends CancellableEvent {
  /**
   * @param player The player whose task was uncompleted
   * @param taskIndex The index of the task that was uncompleted from the player's task list
   * @param taskInfo The task that was uncompleted
   */
  constructor(
    private readonly player: PlayerInstance,
    private readonly taskIndex: number,
    private readonly taskInfo: LevelTask,
  ) {
    super();
  }

  /**
   * Gets the player whose task was uncompleted.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the index of the task that was uncompleted from the player's task list.
   */
  getTaskIndex(): number {
    return this.taskIndex;
  }

  /**
   * Gets the task that was uncompleted.
   */
  getTaskInfo(): LevelTask {
    return this.taskInfo;
  }
}
