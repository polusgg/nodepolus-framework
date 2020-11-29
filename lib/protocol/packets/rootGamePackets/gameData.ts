import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootGamePacketType, GameDataPacketType } from "../types";
import { SceneChangePacket } from "./gameDataPackets/sceneChange";
import { DespawnPacket } from "./gameDataPackets/despawn";
import { DEFAULT_ROOM } from "../../../util/constants";
import { ReadyPacket } from "./gameDataPackets/ready";
import { SpawnPacket } from "./gameDataPackets/spawn";
import { DataPacket } from "./gameDataPackets/data";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RPCPacket } from "./gameDataPackets/rpc";
import { Level } from "../../../types/level";

export type GameDataPacketDataType = DespawnPacket | ReadyPacket | SceneChangePacket | SpawnPacket | RPCPacket;

export class GameDataPacket extends BaseRootGamePacket {
  constructor(
    public readonly packets: GameDataPacketDataType[],
    public readonly roomCode?: string,
    public readonly targetClientId?: number,
  ) {
    super(RootGamePacketType[targetClientId ? "GameDataTo" : "GameData"]);

    if (targetClientId) {
      this.targetClientId = targetClientId;
    }

    this.roomCode = roomCode;
    this.packets = packets;
  }

  static deserialize(reader: MessageReader, level?: Level): GameDataPacket {
    let roomCode: string = RoomCode.decode(reader.readInt32());
    let targetClientId: number | undefined;

    if (reader.tag == RootGamePacketType.GameDataTo) {
      targetClientId = reader.readPackedUInt32();
    }

    let packets: GameDataPacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case GameDataPacketType.Data:
          return packets.push(DataPacket.deserialize(child));
        case GameDataPacketType.RPC:
          return packets.push(RPCPacket.deserialize(child, level));
        case GameDataPacketType.Spawn:
          return packets.push(SpawnPacket.deserialize(child));
        case GameDataPacketType.Despawn:
          return packets.push(DespawnPacket.deserialize(child));
        case GameDataPacketType.SceneChange:
          return packets.push(SceneChangePacket.deserialize(child));
        case GameDataPacketType.Ready:
          return packets.push(ReadyPacket.deserialize(child));
        default:
          throw new Error("Unhandled GameData(To) packet type: " + child.tag);
      }
    });

    return new GameDataPacket(packets, roomCode, targetClientId);
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    if (this.roomCode) {
      writer.writeUInt32(RoomCode.encode(this.roomCode));
    } else {
      writer.writeUInt32(DEFAULT_ROOM);
    }

    if (this.targetClientId) {
      writer.writePackedUInt32(this.targetClientId);
    }

    for (let i = 0; i < this.packets.length; i++) {
      const packet = this.packets[i];

      writer.startMessage(packet.type).writeBytes(packet.serialize()).endMessage();
    }

    return writer;
  }
}
