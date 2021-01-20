import { ConnectionInfo } from ".";

/**
 * An interface used to mark any implementing class as having a connection.
 */
export interface NetworkAccessible {
  /**
   * Gets the ConnectionInfo describing the associated connection
   */
  getConnectionInfo(): ConnectionInfo;
}
