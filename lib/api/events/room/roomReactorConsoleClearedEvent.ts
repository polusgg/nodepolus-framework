import { CancellableEvent } from "../types";

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
