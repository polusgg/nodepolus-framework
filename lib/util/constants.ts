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
 * The default IPv4 address that NodePolus will bind to.
 */
export const DEFAULT_SERVER_ADDRESS = "0.0.0.0";

/**
 * The default port that NodePolus will listen on.
 */
export const DEFAULT_SERVER_PORT = 22023;

/**
 * The default port that the announcement server will listen on.
 */
export const DEFAULT_ANNOUNCEMENT_SERVER_PORT = 22024;

/**
 * The maximum byte size of an outgoing packet.
 */
export const MAX_PACKET_BYTE_SIZE = 508;

/**
 * The owner ID of the global object for game objects not owned by players.
 */
export const GLOBAL_OWNER = -2;
