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

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTaskType(): TaskType {
    return this.taskType;
  }

  setTaskType(task: TaskType): void {
    this.taskType = task;
  }
}
