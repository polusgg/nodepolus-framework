import { BaseInnerNetObject } from "../protocol/entities/types";
import { BaseRpcPacket } from "../protocol/packets/rpc";
import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

export type CustomRpcPacketContainer = {
  deserialize(reader: MessageReader): BaseRpcPacket;
  handle(connection: Connection, packet: BaseRpcPacket, sender?: BaseInnerNetObject): void;
};
