import { Vector2 } from "../../../types";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerTeleportedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldPosition: Vector2,
    public readonly newPosition: Vector2,
  ) {
    super();
  }
}
