export enum HazelPacketType {
  Unreliable = 0x00,
  Reliable = 0x01,
  Hello = 0x08,
  Disconnect = 0x09,
  Acknowledgement = 0x0a,
  Fragment = 0x0b,
  Ping = 0x0c,
}
