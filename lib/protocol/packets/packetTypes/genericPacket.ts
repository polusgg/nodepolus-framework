import { JoinGameErrorPacket, JoinGameRequestPacket, JoinGameResponsePacket } from "../rootGamePackets/joinGame";
import { GetGameListRequestPacket, GetGameListResponsePacket } from "../rootGamePackets/getGameList";
import { HostGameRequestPacket, HostGameResponsePacket } from "../rootGamePackets/hostGame";
import { LateRejectionPacket, RemovePlayerPacket } from "../rootGamePackets/removePlayer";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ReselectServerPacket } from "../rootGamePackets/reselectServer";
import { AlterGameTagPacket } from "../rootGamePackets/alterGameTag";
import { WaitForHostPacket } from "../rootGamePackets/waitForHost";
import { JoinedGamePacket } from "../rootGamePackets/joinedGame";
import { KickPlayerPacket } from "../rootGamePackets/kickPlayer";
import { RemoveGamePacket } from "../rootGamePackets/removeGame";
import { StartGamePacket } from "../rootGamePackets/startGame";
import { GameDataPacket } from "../rootGamePackets/gameData";
import { RedirectPacket } from "../rootGamePackets/redirect";
import { EndGamePacket } from "../rootGamePackets/endGame";
import { RootGamePacketType } from "../types";
import { Level } from "../../../types/level";

export type RootGamePacketDataType =
  | HostGameRequestPacket
  | HostGameResponsePacket
  | JoinGameRequestPacket
  | JoinGameResponsePacket
  | JoinGameErrorPacket
  | StartGamePacket
  | RemoveGamePacket
  | RemovePlayerPacket
  | LateRejectionPacket
  | GameDataPacket
  | JoinedGamePacket
  | EndGamePacket
  | AlterGameTagPacket
  | KickPlayerPacket
  | WaitForHostPacket
  | RedirectPacket
  | ReselectServerPacket
  | GetGameListRequestPacket
  | GetGameListResponsePacket;

export class RootGamePacket {
  constructor(public readonly packets: RootGamePacketDataType[]) {}

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): RootGamePacket {
    const packets: RootGamePacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case RootGamePacketType.HostGame:
          if (clientBound) {
            packets.push(HostGameResponsePacket.deserialize(child));
          } else {
            packets.push(HostGameRequestPacket.deserialize(child));
          }
          break;
        case RootGamePacketType.JoinGame:
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
        case RootGamePacketType.StartGame:
          packets.push(StartGamePacket.deserialize(child));
          break;
        case RootGamePacketType.RemoveGame:
          packets.push(RemoveGamePacket.deserialize(child));
          break;
        case RootGamePacketType.RemovePlayer:
          if (clientBound) {
            packets.push(LateRejectionPacket.deserialize(child));
          } else {
            packets.push(RemovePlayerPacket.deserialize(child));
          }
          break;
        case RootGamePacketType.GameData:
        case RootGamePacketType.GameDataTo:
          packets.push(GameDataPacket.deserialize(child, level));
          break;
        case RootGamePacketType.JoinedGame:
          packets.push(JoinedGamePacket.deserialize(child));
          break;
        case RootGamePacketType.EndGame:
          packets.push(EndGamePacket.deserialize(child));
          break;
        case RootGamePacketType.AlterGameTag:
          packets.push(AlterGameTagPacket.deserialize(child));
          break;
        case RootGamePacketType.KickPlayer:
          packets.push(KickPlayerPacket.deserialize(child));
          break;
        case RootGamePacketType.WaitForHost:
          packets.push(WaitForHostPacket.deserialize(child));
          break;
        case RootGamePacketType.Redirect:
          packets.push(RedirectPacket.deserialize(child));
          break;
        case RootGamePacketType.ReselectServer:
          packets.push(ReselectServerPacket.deserialize(child));
          break;
        case RootGamePacketType.GetGameList:
          if (clientBound) {
            packets.push(GetGameListResponsePacket.deserialize(child));
          } else {
            packets.push(GetGameListRequestPacket.deserialize(child));
          }
          break;
        default:
          throw new Error(`Attempted to deserialize an unimplemented root game packet type: ${child.tag} (${RootGamePacketType[child.tag]})`);
      }
    });

    return new RootGamePacket(packets);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type).writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}
