import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelTask } from "../../../types";

/**
 * Fired when a player has had one or more of their tasks removed.
 */
export class PlayerTaskRemovedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly tasks: LevelTask[],
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getTasks(): LevelTask[] {
    return this.tasks;
  }
}
