import { Door } from "../../game";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

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
