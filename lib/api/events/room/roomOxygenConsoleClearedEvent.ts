import { CancellableEvent } from "../types";

/**
 * Fired when an oxygen console has been reset.
 */
export class RoomOxygenConsoleClearedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
