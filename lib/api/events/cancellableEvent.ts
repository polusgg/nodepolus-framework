export abstract class CancellableEvent {
  private cancelled = false;

  get isCancelled(): boolean {
    return this.cancelled;
  }

  cancel(isCancelled: boolean = true): void {
    this.cancelled = isCancelled;
  }
}
