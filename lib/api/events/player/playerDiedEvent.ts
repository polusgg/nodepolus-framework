import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has died, either by being exiled or by being murdered.
 */
export class PlayerDiedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly reason: DeathReason,
    private readonly killer?: PlayerInstance,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getReason(): DeathReason {
    return this.reason;
  }

  getKiller(): PlayerInstance | undefined {
    return this.killer;
  }
}
