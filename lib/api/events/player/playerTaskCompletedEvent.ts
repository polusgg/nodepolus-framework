import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has completed one of their tasks.
 */
export class PlayerTaskCompletedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly task: Task,
  ) {
    super();
  }
}
