import { CacheDataPacket, AnnouncementDataPacket, FreeWeekendPacket } from "../../announcement";

export type AnnouncementPacketDataType =
  | CacheDataPacket
  | AnnouncementDataPacket
  | FreeWeekendPacket;
