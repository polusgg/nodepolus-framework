export abstract class CancellableEvent {
  private cancelled = false;

  cancel(isCancelled: boolean = true): void {
    this.cancelled = isCancelled;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
