import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootGamePacketType, GameDataPacketType } from "../types";
import { SceneChangePacket } from "./gameDataPackets/sceneChange";
import { DespawnPacket } from "./gameDataPackets/despawn";
import { ReadyPacket } from "./gameDataPackets/ready";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";

export type GameDataPacketDataType = DespawnPacket | ReadyPacket | SceneChangePacket;

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

  static deserialize(reader: MessageReader): GameDataPacket {
    let roomCode: string = RoomCode.decode(reader.readInt32());
    let targetClientId: number | undefined;

    if (reader.tag == RootGamePacketType.GameDataTo) {
      targetClientId = reader.readPackedUInt32();
    }

    let packets: GameDataPacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case GameDataPacketType.Despawn:
          packets.push(DespawnPacket.deserialize(child));
          break;
        case GameDataPacketType.Ready:
          packets.push(ReadyPacket.deserialize(child));
          break;
        case GameDataPacketType.SceneChange:
          packets.push(SceneChangePacket.deserialize(child));
          break;
      }
    });

    return new GameDataPacket(packets, roomCode, targetClientId);
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter()
    if (this.roomCode) {
      writer.writeUInt32(RoomCode.encode(this.roomCode));
    } else {
      writer.writeUInt32(32) // default room
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
