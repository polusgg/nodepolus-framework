export class RoomCommunicationsConsoleClosedEvent {
  constructor(
    private readonly console: number,
  ) {}

  getConsole(): number {
    return this.console;
  }
}
