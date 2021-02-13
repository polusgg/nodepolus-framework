/**
 * An interface used to mark any implementing packet as being bindable to a
 * single direction between the server and client.
 */
export interface Bindable<T> {
  /**
   * Sets whether or not the packet is being sent from the server to a client.
   *
   * @param isClientBound - `true` if the packet is being sent from the server to a client, `false` if it was sent from a client to the server
   */
  bound(isClientBound: boolean): T;
}
