export class RoomCommunicationsConsoleOpenedEvent {
  constructor(
    private readonly console: number,
  ) {}

  getConsole(): number {
    return this.console;
  }
}
