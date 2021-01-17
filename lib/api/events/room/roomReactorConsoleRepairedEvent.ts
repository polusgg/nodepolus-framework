import { CancellableEvent } from "../types";

/**
 * Fired when a reactor console has been repaired.
 */
export class RoomReactorConsoleRepairedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
