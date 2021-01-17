/**
 * Fired when a communications console has been closed by a player.
 */
export class RoomCommunicationsConsoleClosedEvent {
  constructor(
    private readonly console: number,
  ) {}

  getConsole(): number {
    return this.console;
  }
}
