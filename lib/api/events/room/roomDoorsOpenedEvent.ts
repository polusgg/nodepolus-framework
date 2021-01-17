import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Door } from "../../game";

/**
 * Fired when the doors of a room have opened.
 */
export class RoomDoorsOpenedEvent extends CancellableEvent {
  constructor(
    private doors: Door[],
    private readonly opener: PlayerInstance,
  ) {
    super();
  }

  getDoors(): Door[] {
    return this.doors;
  }

  setDoors(doors: Door[]): void {
    this.doors = doors;
  }

  getOpener(): PlayerInstance {
    return this.opener;
  }
}
