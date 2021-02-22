import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Level, RootPacketType } from "../../../types/enums";
import { CustomRootPacketContainer } from "../../../types";
import { Connection } from "../../connection";
import {
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
  ReselectServerPacket,
  StartGamePacket,
  WaitForHostPacket,
  BaseRootPacket,
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
            packets.push(HostGameResponsePacket.deserialize(child));
          } else {
            packets.push(HostGameRequestPacket.deserialize(child));
          }
          break;
        case RootPacketType.JoinGame:
          if (clientBound) {
            if (child.getBuffer().length <= 4) {
              packets.push(JoinGameErrorPacket.deserialize(child));
            } else {
              packets.push(JoinGameResponsePacket.deserialize(child));
            }
          } else {
            packets.push(JoinGameRequestPacket.deserialize(child));
          }
          break;
        case RootPacketType.StartGame:
          packets.push(StartGamePacket.deserialize(child));
          break;
        case RootPacketType.RemoveGame:
          packets.push(RemoveGamePacket.deserialize(child));
          break;
        case RootPacketType.RemovePlayer:
          if (clientBound) {
            packets.push(LateRejectionPacket.deserialize(child));
          } else {
            packets.push(RemovePlayerPacket.deserialize(child));
          }
          break;
        case RootPacketType.GameData:
        case RootPacketType.GameDataTo:
          packets.push(GameDataPacket.deserialize(child, level));
          break;
        case RootPacketType.JoinedGame:
          packets.push(JoinedGamePacket.deserialize(child));
          break;
        case RootPacketType.EndGame:
          packets.push(EndGamePacket.deserialize(child));
          break;
        case RootPacketType.AlterGameTag:
          packets.push(AlterGameTagPacket.deserialize(child));
          break;
        case RootPacketType.KickPlayer:
          packets.push(KickPlayerPacket.deserialize(child));
          break;
        case RootPacketType.WaitForHost:
          packets.push(WaitForHostPacket.deserialize(child));
          break;
        case RootPacketType.Redirect:
          packets.push(RedirectPacket.deserialize(child));
          break;
        case RootPacketType.ReselectServer:
          packets.push(ReselectServerPacket.deserialize(child));
          break;
        case RootPacketType.GetGameList:
          if (clientBound) {
            packets.push(GetGameListResponsePacket.deserialize(child));
          } else {
            packets.push(GetGameListRequestPacket.deserialize(child));
          }
          break;
        default: {
          const custom = RootPacket.customPackets.get(child.getTag());

          if (custom !== undefined) {
            packets.push(custom.deserialize(child));

            break;
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

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].getType())
        .writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}
