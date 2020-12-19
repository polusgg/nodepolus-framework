export enum DefaultHostState {
  Server,
  Client,
}

export interface ServerConfig {
  serverAddress?: string;
  serverPort?: number;
  defaultHost?: DefaultHostState;
  defaultRoomAddress?: string;
  defaultRoomPort?: number;
}
