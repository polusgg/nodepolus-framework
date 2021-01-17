import { CancellableEvent } from "../types";

/**
 * Fired when a communications console has been repaired.
 */
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
