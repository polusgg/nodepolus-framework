/**
 * Fired when a communications console has been opened by a player.
 */
export class RoomCommunicationsConsoleOpenedEvent {
  constructor(
    private readonly console: number,
  ) {}

  getConsole(): number {
    return this.console;
  }
}
