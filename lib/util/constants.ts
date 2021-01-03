/**
 * Primitive type constants
 */
export enum MaxValue {
  Int8 = 127,
  UInt8 = 255,
  Int16 = 32767,
  UInt16 = 65535,
  Int32 = 2147483647,
  UInt32 = 4294967295,
}

export enum MinValue {
  Int8 = -128,
  UInt8 = 0,
  Int16 = -32768,
  UInt16 = 0,
  Int32 = -2147483648,
  UInt32 = 0,
}

/**
 * Server constants
 */
export const DEFAULT_SERVER_ADDRESS = "0.0.0.0";

export const DEFAULT_SERVER_PORT = 22023;

export const ANNOUNCEMENT_SERVER_PORT = 22024;

/**
 * Connection constants
 */
export const MAX_PACKET_BYTE_SIZE = 508;

/**
 * Lobby constants
 */
export const GLOBAL_OWNER = -2;

export const DEFAULT_LOBBY = 32;
