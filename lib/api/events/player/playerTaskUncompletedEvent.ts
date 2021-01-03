import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has had one of their tasks updated to an incomplete state.
 */
export class PlayerTaskUncompletedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly taskIndex: number,
    private readonly taskInfo: LevelTask,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTaskIndex(): number {
    return this.taskIndex;
  }

  getTaskInfo(): LevelTask {
    return this.taskInfo;
  }
}
