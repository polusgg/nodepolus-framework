import { GameDataPacketType, Level, RootPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { CustomGameDataPacketContainer } from "../../../types";
import { LobbyCode } from "../../../util/lobbyCode";
import { Connection } from "../../connection";
import { BaseRootPacket } from "../root";
import {
  BaseGameDataPacket,
  ClientInfoPacket,
  DataPacket,
  DespawnPacket,
  ReadyPacket,
  RpcPacket,
  SceneChangePacket,
  SpawnPacket,
} from "../gameData";

/**
 * Root Packet ID: `0x05` (`5`)
 */
export class GameDataPacket extends BaseRootPacket {
  private static readonly customPackets: Map<number, CustomGameDataPacketContainer> = new Map();

  constructor(
    public packets: BaseGameDataPacket[],
    public lobbyCode: string,
    public targetClientId?: number,
  ) {
    super(RootPacketType[targetClientId !== undefined ? "GameDataTo" : "GameData"]);
  }

  static registerPacket<T extends BaseGameDataPacket>(id: number, deserializer: (reader: MessageReader) => T, handler: (connection: Connection, packet: T) => void): void {
    if (id in GameDataPacketType || GameDataPacket.customPackets.has(id)) {
      throw new Error(`Attempted to register a custom GameData packet using an ID that is already in use: ${id}`);
    }

    GameDataPacket.customPackets.set(id, {
      deserialize: deserializer,
      handle: handler,
    });
  }

  static unregisterPacket(id: number): void {
    GameDataPacket.customPackets.delete(id);
  }

  static hasPacket(id: number): boolean {
    return GameDataPacket.customPackets.has(id);
  }

  static getPacket(id: number): CustomGameDataPacketContainer | undefined {
    return GameDataPacket.customPackets.get(id);
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
        case GameDataPacketType.ClientInfo:
          return packets.push(ClientInfoPacket.deserialize(child));
        default: {
          const custom = GameDataPacket.customPackets.get(child.getTag());

          if (custom !== undefined) {
            return packets.push(custom.deserialize(child));
          }

          throw new Error(`Attempted to deserialize an unimplemented game data packet type: ${child.getTag()} (${GameDataPacketType[child.getTag()]})`);
        }
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

  serialize(writer: MessageWriter): void {
    writer.writeInt32(LobbyCode.encode(this.lobbyCode));

    if (this.targetClientId !== undefined) {
      writer.writePackedUInt32(this.targetClientId);
    }

    for (let i = 0; i < this.packets.length; i++) {
      const packet = this.packets[i];

      writer.startMessage(packet.getType())
        .writeObject(packet)
        .endMessage();
    }
  }
}
