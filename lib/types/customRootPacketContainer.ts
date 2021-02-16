import { BaseRootPacket } from "../protocol/packets/root";
import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

export type CustomRootPacketContainer = {
  deserialize(reader: MessageReader): BaseRootPacket;
  handle(connection: Connection, packet: BaseRootPacket): void;
};
