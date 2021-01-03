import { PlayerColor } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's color has been updated.
 */
export class PlayerColorUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldColor: PlayerColor,
    private newColor: PlayerColor,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldColor(): PlayerColor {
    return this.oldColor;
  }

  getNewColor(): PlayerColor {
    return this.newColor;
  }

  setNetColor(newColor: PlayerColor): void {
    this.newColor = newColor;
  }
}
