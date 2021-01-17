import { CancellableEvent } from "../types";

/**
 * Fired when a communications console has been reset.
 */
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
