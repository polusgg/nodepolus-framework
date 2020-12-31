import dgram from "dgram";

// TODO: Use ConnectionInfo if/when we start working on this again
export type ProxyConfig = {
  server: dgram.RemoteInfo;
};
