import { CancellableEvent } from "../types";

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
