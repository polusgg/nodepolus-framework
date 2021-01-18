import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a switch has been flipped during an electrical sabotage.
 */
export class RoomElectricalInteractedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly index: number,
    private state: boolean,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the switch that was flipped.
   */
  getIndex(): number {
    return this.index;
  }

  /**
   * Gets the toggled state of the switch.
   *
   * @returns `true` if flipped up, `false` if down
   */
  isFlipped(): boolean {
    return this.state;
  }

  /**
   * Sets the toggles state of the switch.
   *
   * @param state The new toggled state of the switch: `true` for flipped up, `false` for down
   */
  setFlipped(state: boolean): void {
    this.state = state;
  }
}
