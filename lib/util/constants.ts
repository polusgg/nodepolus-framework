import { AllRequired, Immutable } from "../types";
import { ServerConfig } from "../api/config";

/**
 * A mapping of integer types to their minimum values.
 */
export enum MinValue {
  Int8 = -128,
  UInt8 = 0,
  Int16 = -32768,
  UInt16 = 0,
  Int32 = -2147483648,
  UInt32 = 0,
}

/**
 * A mapping of integer types to their maximum values.
 */
export enum MaxValue {
  Int8 = 127,
  UInt8 = 255,
  Int16 = 32767,
  UInt16 = 65535,
  Int32 = 2147483647,
  UInt32 = 4294967295,
}

/**
 * The default ServerConfig values.
 */
export const DEFAULT_CONFIG: Immutable<AllRequired<ServerConfig>> = {
  serverAddress: "0.0.0.0",
  serverPort: 22023,
  enableAnnouncementServer: false,
  maxLobbies: 100000,
  maxConnectionsPerAddress: 10,
  lobby: {
    defaultAddress: "0.0.0.0",
    defaultPort: 22023,
    defaultStartTimerDuration: 5,
    maxPlayers: 10,
  },
  logging: {
    level: "info",
    filename: "server.log",
    maxFileSizeInBytes: 104857600,
    maxFiles: 10,
  },
};

/**
 * The port that the announcement server will listen on.
 */
export const ANNOUNCEMENT_SERVER_PORT = 22024;

/**
 * The maximum byte size of an outgoing packet.
 */
export const MAX_PACKET_BYTE_SIZE = 508;

/**
 * The owner ID of the global object for game objects not owned by players.
 */
export const GLOBAL_OWNER = -2;

/**
 * The default in-game chat languages.
 */
export const DEFAULT_LANGUAGES: ReadonlyMap<number, string> = new Map([
  [2, "Other"],
  [4, "Spanish"],
  [8, "\u{D55C}\u{AD6D}\u{C5B4}"],
  [16, "P\u{0443}\u{0441}\u{0441}\u{043A}\u{0438}\u{0439}"],
  [32, "Portugu\u{00EA}s"],
  [64, "Arabic"],
  [128, "Filipino"],
  [256, "Polskie"],
]);
