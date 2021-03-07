import { BaseGameDataPacket } from "../protocol/packets/gameData";
import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";
import { LobbyInstance } from "../api/lobby";

export type CustomGameDataPacketContainer = {
  deserialize(reader: MessageReader): BaseGameDataPacket;

  handle(connection: Connection, packet: BaseGameDataPacket, lobby: LobbyInstance): void;
};
