import { Vector2 } from "../../../types";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class MovedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldPosition: Vector2,
    public readonly oldVelocity: Vector2,
    public readonly newPosition: Vector2,
    public readonly newVelocity: Vector2,
  ) {
    super();
  }
}
