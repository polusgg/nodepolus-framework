import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Level, RootPacketType } from "../../../types/enums";
import { CustomRootPacketContainer } from "../../../types";
import { Connection } from "../../connection";
import {
  BaseRootPacket,
  AlterGameTagPacket,
  EndGamePacket,
  GameDataPacket,
  GetGameListRequestPacket,
  GetGameListResponsePacket,
  HostGameRequestPacket,
  HostGameResponsePacket,
  JoinGameErrorPacket,
  JoinGameRequestPacket,
  JoinGameResponsePacket,
  JoinedGamePacket,
  KickPlayerPacket,
  LateRejectionPacket,
  RedirectPacket,
  RemoveGamePacket,
  RemovePlayerPacket,
  ReportPlayerRequestPacket,
  ReportPlayerResponsePacket,
  ReselectServerPacket,
  StartGamePacket,
  WaitForHostPacket,
} from "../root";

export class RootPacket {
  private static readonly customPackets: Map<number, CustomRootPacketContainer> = new Map();

  constructor(
    public packets: BaseRootPacket[],
  ) {}

  static registerPacket<T extends BaseRootPacket>(id: number, deserializer: (reader: MessageReader) => T, handler: (connection: Connection, packet: T) => void): void {
    if (id in RootPacketType || RootPacket.customPackets.has(id)) {
      throw new Error(`Attempted to register a custom packet using an ID that is already in use: ${id}`);
    }

    RootPacket.customPackets.set(id, {
      deserialize: deserializer,
      handle: handler,
    });
  }

  static unregisterPacket(id: number): void {
    RootPacket.customPackets.delete(id);
  }

  static hasPacket(id: number): boolean {
    return RootPacket.customPackets.has(id);
  }

  static getPacket(id: number): CustomRootPacketContainer | undefined {
    return RootPacket.customPackets.get(id);
  }

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): RootPacket {
    const packets: BaseRootPacket[] = [];

    reader.readAllChildMessages(child => {
      switch (child.getTag()) {
        case RootPacketType.HostGame:
          if (clientBound) {
            return packets.push(HostGameResponsePacket.deserialize(child));
          }

          return packets.push(HostGameRequestPacket.deserialize(child));
        case RootPacketType.JoinGame:
          if (clientBound) {
            if (child.getBuffer().length <= 4) {
              return packets.push(JoinGameErrorPacket.deserialize(child));
            }

            return packets.push(JoinGameResponsePacket.deserialize(child));
          }

          return packets.push(JoinGameRequestPacket.deserialize(child));
        case RootPacketType.StartGame:
          return packets.push(StartGamePacket.deserialize(child));
        case RootPacketType.RemoveGame:
          return packets.push(RemoveGamePacket.deserialize(child));
        case RootPacketType.RemovePlayer:
          if (clientBound) {
            return packets.push(LateRejectionPacket.deserialize(child));
          }

          return packets.push(RemovePlayerPacket.deserialize(child));
        case RootPacketType.GameData:
        case RootPacketType.GameDataTo:
          return packets.push(GameDataPacket.deserialize(child, level));
        case RootPacketType.JoinedGame:
          return packets.push(JoinedGamePacket.deserialize(child));
        case RootPacketType.EndGame:
          return packets.push(EndGamePacket.deserialize(child));
        case RootPacketType.AlterGameTag:
          return packets.push(AlterGameTagPacket.deserialize(child));
        case RootPacketType.KickPlayer:
          return packets.push(KickPlayerPacket.deserialize(child));
        case RootPacketType.WaitForHost:
          return packets.push(WaitForHostPacket.deserialize(child));
        case RootPacketType.Redirect:
          return packets.push(RedirectPacket.deserialize(child));
        case RootPacketType.ReselectServer:
          return packets.push(ReselectServerPacket.deserialize(child));
        case RootPacketType.GetGameList:
          if (clientBound) {
            return packets.push(GetGameListResponsePacket.deserialize(child));
          }

          return packets.push(GetGameListRequestPacket.deserialize(child));
        case RootPacketType.ReportPlayer:
          if (clientBound) {
            return packets.push(ReportPlayerResponsePacket.deserialize(child));
          }

          return packets.push(ReportPlayerRequestPacket.deserialize(child));
        default: {
          const custom = RootPacket.customPackets.get(child.getTag());

          if (custom !== undefined) {
            return packets.push(custom.deserialize(child));
          }

          throw new Error(`Attempted to deserialize an unimplemented root game packet type: ${child.getTag()} (${RootPacketType[child.getTag()]})`);
        }
      }
    });

    return new RootPacket(packets);
  }

  clone(): RootPacket {
    const packets = new Array(this.packets.length);

    for (let i = 0; i < packets.length; i++) {
      packets[i] = this.packets[i].clone();
    }

    return new RootPacket(packets);
  }

  serialize(writer: MessageWriter): void {
    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].getType())
        .writeObject(this.packets[i])
        .endMessage();
    }
  }
}
