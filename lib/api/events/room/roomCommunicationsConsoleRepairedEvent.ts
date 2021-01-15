import { CancellableEvent } from "../types";

export class RoomCommunicationsConsoleRepairedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
