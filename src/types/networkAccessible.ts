import { ConnectionInfo } from ".";

/**
 * An interface used to mark any implementing class as having a connection
 * identifier.
 */
export interface NetworkAccessible {
  /**
   * Gets the ConnectionInfo identifier describing the object.
   */
  getConnectionInfo(): ConnectionInfo;
}
