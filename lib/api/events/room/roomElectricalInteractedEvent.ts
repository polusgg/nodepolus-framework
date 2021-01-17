import { CancellableEvent } from "../types";

/**
 * Fired when a switch has been flipped during an electrical sabotage.
 */
export class RoomElectricalInteractedEvent extends CancellableEvent {
  constructor(
    private readonly index: number,
    private state: boolean,
  ) {
    super();
  }

  getIndex(): number {
    return this.index;
  }

  getState(): boolean {
    return this.state;
  }

  setState(state: boolean): void {
    this.state = state;
  }
}
