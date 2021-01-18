import { TaskType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has completed one of their tasks.
 */
export class PlayerTaskAnimationEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private taskType: TaskType,
  ) {
    super();
  }

  /**
   * Gets the player that is playing a task animation.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the type of task whose animation is being played.
   */
  getTaskType(): TaskType {
    return this.taskType;
  }

  /**
   * Sets the type of task whose animation is being played.
   *
   * @param task The new type of task whose animation is being played
   */
  setTaskType(task: TaskType): void {
    this.taskType = task;
  }
}
