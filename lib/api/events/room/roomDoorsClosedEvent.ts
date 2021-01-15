import { Door } from "../../game";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

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
