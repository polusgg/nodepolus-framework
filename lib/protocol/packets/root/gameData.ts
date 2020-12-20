import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType, RootGamePacketType } from "../types";
import { SceneChangePacket } from "../gameData/sceneChange";
import { DespawnPacket } from "../gameData/despawn";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootGamePacket } from "../basePacket";
import { ReadyPacket } from "../gameData/ready";
import { SpawnPacket } from "../gameData/spawn";
import { DataPacket } from "../gameData/data";
import { Level } from "../../../types/level";
import { RPCPacket } from "../gameData/rpc";

export type GameDataPacketDataType = DespawnPacket | ReadyPacket | SceneChangePacket | SpawnPacket | RPCPacket;

export class GameDataPacket extends BaseRootGamePacket {
  constructor(
    public readonly packets: GameDataPacketDataType[],
    public readonly lobbyCode: string,
    public readonly targetClientId?: number,
  ) {
    super(RootGamePacketType[targetClientId ? "GameDataTo" : "GameData"]);

    if (targetClientId) {
      this.targetClientId = targetClientId;
    }

    this.lobbyCode = lobbyCode;
    this.packets = packets;
  }

  static deserialize(reader: MessageReader, level?: Level): GameDataPacket {
    const lobbyCode: string = LobbyCode.decode(reader.readInt32());
    let targetClientId: number | undefined;

    if (reader.tag == RootGamePacketType.GameDataTo) {
      targetClientId = reader.readPackedUInt32();
    }

    const packets: GameDataPacketDataType[] = [];

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
          throw new Error(`Attempted to deserialize an unimplemented game data packet type: ${child.tag} (${GameDataPacketType[child.tag]})`);
      }
    });

    return new GameDataPacket(packets, lobbyCode, targetClientId);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeInt32(LobbyCode.encode(this.lobbyCode));

    if (this.targetClientId || this.targetClientId === 0) {
      writer.writePackedUInt32(this.targetClientId);
    }

    for (let i = 0; i < this.packets.length; i++) {
      const packet = this.packets[i];

      writer.startMessage(packet.type)
        .writeBytes(packet.serialize())
        .endMessage();
    }

    return writer;
  }
}
