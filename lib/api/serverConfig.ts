// TODO: Merge with server config in server/index.ts
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
