import { CancellableEvent } from "../cancellableEvent";
import { Vector2 } from "../../../types/vector2";
import { Player } from "../../player";

export class TeleportedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldPosition: Vector2,
    public readonly newPosition: Vector2,
  ) {
    super();
  }
}
