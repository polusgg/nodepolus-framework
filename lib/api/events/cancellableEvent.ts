export abstract class CancellableEvent {
  private cancelled = false;

  // TODO: Add an interface with a `getDisconnectReason` method to be used when
  //       disconnecting a player (e.g. LobbyCreatedEvent)
  cancel(isCancelled: boolean = true): void {
    this.cancelled = isCancelled;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
