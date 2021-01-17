import { CancellableEvent } from "../types";

/**
 * Fired when a reactor console has been reset.
 */
export class RoomReactorConsoleClearedEvent extends CancellableEvent {
  constructor(
    private readonly console: number,
  ) {
    super();
  }

  getConsole(): number {
    return this.console;
  }
}
