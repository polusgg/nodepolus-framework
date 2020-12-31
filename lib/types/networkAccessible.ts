import { ConnectionInfo } from ".";

export interface NetworkAccessible {
  getConnectionInfo(): ConnectionInfo;
}
