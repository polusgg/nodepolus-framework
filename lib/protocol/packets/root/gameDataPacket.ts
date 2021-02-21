import { BaseGameDataPacket, DataPacket, DespawnPacket, ReadyPacket, RpcPacket, SceneChangePacket, SpawnPacket } from "../gameData";
import { GameDataPacketType, Level, RootPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { LobbyCode } from "../../../util/lobbyCode";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x05` (`5`)
 */
export class GameDataPacket extends BaseRootPacket {
  constructor(
    public packets: BaseGameDataPacket[],
    public lobbyCode: string,
    public targetClientId?: number,
  ) {
    super(RootPacketType[targetClientId ? "GameDataTo" : "GameData"]);

    if (targetClientId) {
      this.targetClientId = targetClientId;
    }

    this.lobbyCode = lobbyCode;
    this.packets = packets;
  }

  static deserialize(reader: MessageReader, level?: Level): GameDataPacket {
    const lobbyCode: string = LobbyCode.decode(reader.readInt32());
    let targetClientId: number | undefined;

    if (reader.getTag() == RootPacketType.GameDataTo) {
      targetClientId = reader.readPackedUInt32();
    }

    const packets: BaseGameDataPacket[] = [];

    reader.readAllChildMessages(child => {
      switch (child.getTag()) {
        case GameDataPacketType.Data:
          return packets.push(DataPacket.deserialize(child));
        case GameDataPacketType.RPC:
          return packets.push(RpcPacket.deserialize(child, level));
        case GameDataPacketType.Spawn:
          return packets.push(SpawnPacket.deserialize(child));
        case GameDataPacketType.Despawn:
          return packets.push(DespawnPacket.deserialize(child));
        case GameDataPacketType.SceneChange:
          return packets.push(SceneChangePacket.deserialize(child));
        case GameDataPacketType.Ready:
          return packets.push(ReadyPacket.deserialize(child));
        default:
          throw new Error(`Attempted to deserialize an unimplemented game data packet type: ${child.getTag()} (${GameDataPacketType[child.getTag()]})`);
      }
    });

    return new GameDataPacket(packets, lobbyCode, targetClientId);
  }

  clone(): GameDataPacket {
    const packets = new Array(this.packets.length);

    for (let i = 0; i < packets.length; i++) {
      packets[i] = this.packets[i].clone();
    }

    return new GameDataPacket(packets, this.lobbyCode, this.targetClientId);
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
