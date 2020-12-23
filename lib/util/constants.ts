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
 * Lobby constants
 */
export const GLOBAL_OWNER = -2;

export const DEFAULT_LOBBY = 32;

/**
 * RemoteInfo constants
 */
export const IPV4_REGEX = /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gmi;

// https://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
export const IPV6_REGEX = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gmi;
