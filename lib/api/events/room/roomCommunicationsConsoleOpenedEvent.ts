import { CancellableEvent } from "../types";

export class RoomCommunicationsConsoleOpenedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
