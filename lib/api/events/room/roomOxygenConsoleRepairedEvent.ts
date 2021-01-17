import { CancellableEvent } from "../types";

/**
 * Fired when an oxygen console has been repaired.
 */
export class RoomOxygenConsoleRepairedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
