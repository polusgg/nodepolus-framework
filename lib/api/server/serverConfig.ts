export enum DefaultHostState {
  Server,
  Client,
}

export interface ServerConfig {
  serverAddress?: string;
  serverPort?: number;
  defaultHost?: DefaultHostState;
  defaultLobbyAddress?: string;
  defaultLobbyPort?: number;
}
