import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Task } from "../../game";

/**
 * Fired when a player has had one or more of their tasks removed.
 */
export class PlayerTaskRemovedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public tasks: Task[],
  ) {
    super();
  }
}
