import { PlayerInstance } from "../../player";
import { Vector2 } from "../../../types";
import { CancellableEvent } from "..";

export class PlayerTeleportedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldPosition: Vector2,
    public readonly newPosition: Vector2,
  ) {
    super();
  }
}
