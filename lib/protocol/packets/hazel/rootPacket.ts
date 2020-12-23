import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../types/enums";
import { Level } from "../../../types/enums";
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
  constructor(public readonly packets: BaseRootPacket[]) {}

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): RootPacket {
    const packets: BaseRootPacket[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case RootPacketType.HostGame:
          if (clientBound) {
            packets.push(HostGameResponsePacket.deserialize(child));
          } else {
            packets.push(HostGameRequestPacket.deserialize(child));
          }
          break;
        case RootPacketType.JoinGame:
          if (clientBound) {
            if (child.buffer.length <= 4) {
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
        default:
          throw new Error(`Attempted to deserialize an unimplemented root game packet type: ${child.tag} (${RootPacketType[child.tag]})`);
      }
    });

    return new RootPacket(packets);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type)
        .writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}
