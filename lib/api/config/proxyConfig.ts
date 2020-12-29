import dgram from "dgram";

export type ProxyConfig = {
  server: dgram.RemoteInfo;
};
