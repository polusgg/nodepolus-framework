import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Door } from "../../game";

export class RoomDoorsClosedEvent extends CancellableEvent {
  constructor(
    private doors: Door[],
    private readonly closer: PlayerInstance,
  ) {
    super();
  }

  getDoors(): Door[] {
    return this.doors;
  }

  setDoors(doors: Door[]): void {
    this.doors = doors;
  }

  getCloser(): PlayerInstance {
    return this.closer;
  }
}
