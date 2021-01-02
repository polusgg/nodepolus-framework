export abstract class CancellableEvent {
  private cancelled = false;

  cancel(isCancelled: boolean = true): this {
    this.cancelled = isCancelled;

    return this;
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}
