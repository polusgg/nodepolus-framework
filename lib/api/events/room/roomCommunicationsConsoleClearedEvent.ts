import { CancellableEvent } from "../types";

export class RoomCommunicationsConsoleClearedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
