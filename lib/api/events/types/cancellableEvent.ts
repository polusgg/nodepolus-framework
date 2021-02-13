/**
 * An event that may be cancelled to prevent the action described in the event from happening.
 */
export abstract class CancellableEvent {
  private cancelled = false;

  /**
   * Marks the event as cancelled.
   *
   * @param isCancelled - `true` to cancel, `false` to uncancel (default `true`)
   */
  cancel(isCancelled: boolean = true): this {
    this.cancelled = isCancelled;

    return this;
  }

  /**
   * Gets whether or not the event is marked as cancelled.
   *
   * @returns `true` for cancelled, `false` for not cancelled
   */
  isCancelled(): boolean {
    return this.cancelled;
  }
}
