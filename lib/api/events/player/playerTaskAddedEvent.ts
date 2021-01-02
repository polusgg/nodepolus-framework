import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has been assigned one or more new tasks.
 */
export class PlayerTaskAddedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public tasks: Task[],
  ) {
    super();
  }
}
